import {Request, Response} from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { send } from 'process';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  /**************************************************************************** */
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get( "/deleteimage", async ( req: Request, res: Response ) => {
    
      let imagePath: string = req.query.image_path;

      if (!imagePath){
        return res.status(400).send('image_path query param required!');
      }
     
      deleteLocalFiles([imagePath]);

      res.status(200).send(`${imagePath} deleted`);

  });

  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    let imageUrl: string = req.query.image_url;
    let absoluteFileName: string = "";

    if (!imageUrl){
      return res.status(400).send('image_url query param required!');
    }
     
    // return an absolute path to a filtered image locally saved file
    const fiAbsolutePath = filterImageFromURL(imageUrl);

    absoluteFileName = await fiAbsolutePath.then(value => {return value;});

    fiAbsolutePath.catch(error => {
      console.log(error);
      return res.status(500).send(error);
    });

    res.status(200).sendFile(absoluteFileName);
    
    setTimeout(() => deleteLocalFiles([absoluteFileName]), 100);

  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();