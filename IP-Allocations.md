# Network Allocations

## CIDR

Range         | Use
--------------|----------------------
10.0.0.0/16   | LAN
10.244.0.0/16 | Kubernetes Pods
10.96.0.0/12  | Kubernetes Services


## Range IP Allocations 10.0.0.0/16

Start      | End            | Purpose                                          
-----------|----------------|--------------------------------------------------
10.0.0.1   |                | Router                                           
10.0.0.2   |                | DNS+DHCP                                           
10.0.0.4   |                | Srv0                                             
10.0.0.5   | 10.0.0.59      | *Available*                                      
10.0.0.60  |                | AMP Panel                                        
10.0.0.61  | 10.0.0.79      | *Reserved:* Future Virtual Machines              
10.0.0.80  |                | Cluster Node 0: i7 6700K                         
10.0.0.81  | 10.0.0.89      | *Reserved:* Future Cluster Nodes                 
10.0.0.90  | 10.0.0.99      | *Available*
10.0.0.100 | 10.0.9.255     | *Reserved:* DHCP                                 
10.0.10.0  | 10.0.10.255    | *Reserved: MetalLB Load Balancer*
10.0.11.0  | 10.0.255.255   | *Available*                                      
