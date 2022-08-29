### **Overview**

This server is meant to be running on a shared computer or server constantly, and will handle HTTP requests to print labels automatically or semi-automatically to speed up workflow. The server itself is written in NodeJS, and is functionally a RESTful server.

### **Setup for the server**

---
1. The server is written in NodeJS. Use the [the NodeJS installer](https://nodejs.org/en/), and make sure during installation, you install **`npm`**, as this will be needed. If the following commands spit out version numbers, installation completed correctly:

    ```
    node -v
    npm -v
    ```
---
2. Clone the source, and open the root directory in a terminal window.
---
3. The following dependencies are currently required, and must be installed before use (Either **`npm install -g [packagename]`** for each package, or **`npm install`** to tell node to install all dependencies). An up-to-date list of dependencies can always be found at the botton of **`./package.json`**:
    * [`dotenv`](https://www.npmjs.com/package/dotenv)
    * [`express`](https://www.npmjs.com/package/express)
    * [`morgan`](https://www.npmjs.com/package/morgan)
    * [`node-fetch@2.6.1`](https://www.npmjs.com/package/node-fetch) **Dependent on version 2.6.1**
    * [`node-hide-console-window`](https://www.npmjs.com/package/node-hide-console-window)
    * [`nodemon`](https://www.npmjs.com/package/nodemon)
    * [`winston@2.4.5`](https://www.npmjs.com/package/winston) **Dependent on version 2.4.5**
    * [`winston-papertrail`](https://www.npmjs.com/winston-papertrail)
---
4. The server is setup to log all events and information to an external [Papertrail](https://papertrailapp.com/) log. To set this up, create a Papertrail account. In <kbd>Settings</kbd> > [<kbd>Log Destiniations</kbd>](https://papertrailapp.com/account/destinations), you will have the option to <kbd>Create Log Destiniation</kbd>. Once you do, you will be provided with a destination URL and a destination port. This information will be needed in the next step.**<sup>[1](#papertrailfootnote)</sup>**
---
5. The **`.env`** file will need to be created (if it does not exist already) in the root of the server (same location as **`app.js`**), and must have the following properties defined:

    ```
    AUTODYMO_AUTH_KEY= #(Authorization key)
    AUTODYMO_IP_WHITELIST= #(IP subnet that should be whitelisted)
    LOGGER_URL= #(URL for Papertrails)
    LOGGER_PORT= #(Port for Papertrails)

    ```

    If you choose to use a custom port for the server (defaulted to 3000), you will also need to define the port with a valid (0 to 65353), unused port number;

    ```
    PORT= #(Server port number)
    ```

    If you are using a custom location for PowerShell script files (i.e., not ../scripts/), you will need specify the path.;

    ```
    SCRIPTS_PATH="C:\...\Scripts\"
    ```
    If you are setting up the server to run on HTTPS, instead of HTTP, you will need to define the standard. (See step 8 for key placement)
    ```
    AUTODYMO_PROTOCOL=#(Protocol for server, i.e http or https)
    ```

    <details>
    <summary>(<b><i>Example <code>.env</code> File</i></b>)</summary>
    <!-- have to be followed by an empty line! -->

        AUTODYMO_AUTH_KEY= authKey123 
        AUTODYMO_IP_WHITELIST= 192.168.1.4
        AUTODYMO_PROTOCOL=http
        PORT=4567

        SCRIPTS_PATH="C:\Scripts\"

        LOGGER_URL= logs1.papertrailapp.com
        LOGGER_PORT= 12345
    </details>

---
7. Port 3000 (or the port defined in the environment variables) will need to be opened. Depending on the local machine's firewall, and your networking setup, this process may wildly vary. The base functionality requires that HTTP requests can be both sent and received using the port.
---
8. If the server is being run on HTTPS, a certificate and key will need to be generated and placed in the `/certs` directory. Naming is important. The certification should be named `autodymo.crt`, and the key should be named `autodymo.key`. Although OpenSSL can be used to generate a key (see below) it is recommended that you do not use a self-signed certificate, as this defeats the purpose of the HTTPS protocol.

    ```
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout autodymo.key -out autodymo.crt
    ```
---

### **Server Startup**

* **`npm start`** should be used to start the server, as npm is setup to:

    * Install dependencies (if not already installed)
    * Using [nodemon](https://www.npmjs.com/package/nodemon), listen for local changes to code, and restart the server when changes are detected.  
* The server should be running all the time, meaning a startup script to run the server may be ideal. The following is a very basic batch script (theoretically cross-os) that would be placed in the startup folder for a user or the system:

    ```
    cd "[path\to\auto-dymo]"
    npm start
    ```
### **Sending a Print Request to the Server**

The server is made to accept [RESTful HTTP requests](https://www.restapitutorial.com/lessons/httpmethods.html), and thus, to send data to the server, a service that can send REST requests is necessary. For development testing, use [Postman](https://www.postman.com) or another basic request generator. For scripting using Tampermonkey or other injection scripting languages, make use of [`GM.xmlHttpRequest`](https://wiki.greasespot.net/GM.xmlHttpRequest). The main print address for the server will be as follows:

    [hostname]:[port]/execute

* To run a script, send a [PUT request](https://www.restapitutorial.com/lessons/httpmethods.html#put) with the following information:
    * Script name
    * Whether or not to run Elevated
    * Authentication key (optional inside whitelisted network, but recommended)
    * Parameters to run script with (optional)
* JSON formatting for PUT request:

    ```javascript
    {
        "scriptName": "ExampleScript.ps1",
        "asRoot": true,
        "authKey": "key123",
        "params": ["Param1", "Param2"]
    }
    ```
* The data will be returned in the following format:

    ```javascript
    {
        "code": "[200, 401, 400]",
        "message": "[Script executed with no errors, Script executed with errors, see logs for more details, Invalid authentication method provided]",
        "executionInfo": {
            "scriptName": "ExampleScript.ps1",
            "asRoot": true,
            "authKey": "key123",
            "params": ["Param1", "Param2"]
        }
    }
    ```
* Possible codes returned:
    * 200 (OK): The ticket was printed successfully
    * 401 (Unauthorized): Authentication failed, either the device does not have a whitelisted ip address, or the authentication key is incorrect
    * 400 (Bad Request): The syntax for the ticket number was incorrect

### Footnotes:

**<a name="papertrailfootnote">1</a>**: In theory you can create a token for accessing Papertrail instead of using `URL:port` access, however this is not currently natively integrated.