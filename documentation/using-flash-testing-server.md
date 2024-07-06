To run the flash testing server, one must first have node installed. Then, they can run the following command in the [`flashTestingServer`](../flashTestingServer/) directory:

`node index.js`

or if one wants to use a different port they can use:

`node index.js <port>`

to specify the host name, they can use

`node index.js <port> <host>`

For example, `node index localhost 4545` runs the server at `localhost` with port `4545`.

After this, they can open up the URL ``http://<host>:<port>/creator2_b17.swf`` in something the flash projector or the ruffle projector. For example, if the host is localhost and the port number is 7889, then they can open up the url ``http://localhost:7889/creator2_b17.swf``.