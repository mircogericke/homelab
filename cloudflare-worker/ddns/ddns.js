/// <reference path="./node_modules/@cloudflare/workers-types/index.d.ts" />

addEventListener('fetch', event => event.respondWith(handleRequest(event.request)));

let cloudflareRoot = "https://api.cloudflare.com/client/v4";

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request)
{
	async function getRecordsToUpdate(authKey, zone, oldIp)
	{
		let uri = `${cloudflareRoot}/zones/${zone}/dns_records?per_page=100&type=A&content=${oldIp}`;
		
		let response = await fetch(uri, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + authKey 
			}
		});

		let body = await response.json();
		return body.result.map(v =>  v.id);
	}

	async function updateRecord(authKey, zone, record, newIp)
	{
		let uri = `${cloudflareRoot}/zones/${zone}/dns_records/${record}`;
		
		let response = await fetch(uri, {
			method: 'PATCH',
			headers: {
				Authorization: 'Bearer ' + authKey,
				'Content-Type': 'application/json' 
			},
			body: JSON.stringify({'content': newIp})
		});

		return response.status;
	}

	/** List of Zone IDs that should be updated */
	async function getZones()
	{
		/** @type string */
		let zones = await DDNS_STORE.get('_zones');
		return zones.split(',');
	}

	try
	{
		const { searchParams } = new URL(request.url);
		let ip = searchParams.get('ip');
		let auth = searchParams.get('auth');
		let oldIp = await DDNS_STORE.get('_ip');

		if (ip === oldIp)
			return new Response('ip did not change', {status: 200})

		let count = 0;
		for(let zone of await getZones())
		{
			let records = await getRecordsToUpdate(auth, zone, oldIp);
			count += records.length;
			for(let record of records)
				await updateRecord(auth, zone, record, ip);
		}

		await DDNS_STORE.put('_ip', ip);
		return new Response(`${count} records updated.`, {status: 200})
	}
	catch(error)
	{
		return new Response(error.message, {status: 500});
	}
}
