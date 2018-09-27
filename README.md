# <a name="project-details"></a>Text Messages embed
Show imessage style text message conversation

#Getting started 

##Prerequisites
Install node, see https://nodejs.org/en/download/

##Installation 
run ```npm install``` 

##Convert 
To convert run ```npm run convert```  

Converting will take text files in data/text-messages and convert to json files in assets/data.
The converter will look for "keys". Each line needs to have a key. Keys are used to identify parts of a message. Keys are followed by a ":" colon.

| Keys | Definitions |
--- | ---
|n|Name of receiver
|t|Timestamp of the message
|s|Message from sender
|r|Message from receiver

Example Usage

```
n: Stannis Baratheon
t: Today 10:53 AM
s: Lorem ipsum dolor sit amet, integer lacus, pharetra mi turpis
r: Corporis scelerisque
s: Elit amet, fringilla magna
```

##Build 
To build run ```npm run build``` 

##Deploy 
To deploy run ```npm run deploy```.
Note that deploy will build prior to deploying.
 
#Updating Example
1. Create or update a new message in data/text-messages. The name of the file will be used to identify, in this example we'll use "shawns-chat.txt"  
2. Run convert with ```npm run convert```  
3. Run deploy with ```npm run deploy```  
4. Wait 15 min for cache to clear  
5. Go to http://www.gannett-cdn.com/experiments/usatoday/responsive/text-messages-embed/?messages=shawns-chat. Note that the messages param is updated to reflect our file name

