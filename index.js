const http = require('http')
const fs = require('fs')
const path = require('path')

// Create a new HTTP server
const server = http.createServer((request, response) => {
  // Log the URL of the incoming request
  console.log(request.url)

  // If the request URL is '/', serve 'index.html', otherwise serve the file requested
  let filename = request.url === '/' ? 'index.html' : request.url 

  // Get the extension of the requested file
  let extname = path.extname(filename)

  let contentType = 'text/html'
  
  // If the requested file is a CSS file, change the content type to 'text/css'
  switch(extname){
    case '.css':
      contentType = 'text/css'
      break;
      case '.js':
        contentType = 'text/javascript'
        break;
      case '.json':
        contentType = 'application/json'
        break;
      case '.jpeg':
        contentType = 'image/jpg'
        break;
      case '.png':
        contentType = 'image/png'
        break;
      case '.ico':
        contentType = 'image/x-icon'
        break;
      }
    
  // If the content type is 'text/html' and the file has no extension, add '.html' to the filename
  if (contentType === 'text/html' && extname === '') {
    filename += '.html'
  }
    
  // Construct the full file path
  let filepath = path.join(__dirname, 'src', filename)

  // Log the file extension
  console.log({extname})

  // Read the requested file
  fs.readFile(filepath, (error, data) => {
    if (error) {
      // If the error is 'ENOENT' (Error NO ENTry), the file was not found
      if(error.code === 'ENOENT') {
        // Read the '404.html' file
        fs.readFile(path.join(__dirname, 'src', '404.html'), (error, info) => {
          // If an error occurred, log it and return
          if(error) {
            console.log(error)
            return
          }
          // Write a 404 status code to the response header
          response.writeHead(404, { 'Content-type': 'text/html'})
          // End the response and send the contents of 'info' (the 404 page)
          response.end(info, 'utf8')
        })
      }
      // If the error is not 'ENOENT'
      else {
        // Write a 500 status code to the response header
        response.writeHead(500)
        // End the response and send a server error message
        response.end(`Server Error: ${error.code}`)
      }
    } else {
      // Write a 200 status code to the response header
      response.writeHead(200, {'Content-Type': contentType})
      // End the response and send the requested file's data
      response.end(data, 'utf8')
    }
  })
})

// Set the port to the environment variable PORT, or 1994 if PORT is not set
const PORT = process.env.PORT || 1994 

// Start the server, listening on the specified port
server.listen(PORT, () => console.log("server running on http://localhost:" + PORT)) 