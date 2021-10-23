import './App.css';
import ImageUploader from 'react-images-upload'
import React, { useState } from "react"
import { request, gql } from "graphql-request";
import { useQuery } from "react-query";

const UploadComponent = props => (
  <form>
    <label>
      <ImageUploader
        key='image-uploader'
        withIcon={true}
        singleImage={true}
        withPreview={true}
        label='Maximum Size File: 5mb'
        buttonText='Choose an Image'
        onChange={props.onImage}
        imgExtension={['.jpg', '.png', '.jpeg']}
        maxFileSize={52428800000}
      ></ImageUploader>
    </label>
  </form>
)

const App = () => {

  const [progress, setProgress ] = useState('getUpload')
  const [errorMessage, setErrorMessage ] = useState('')
  const [textResponse, setTextResponse ] = useState('')

  const onImage = async (failedImages, successImages) => {
    
    setProgress('uploading')

    try {
      console.log('successImages', successImages)
      const parts = successImages[0].split(';')
      const mime = parts[0].split(':')[1]
      const name = parts[1].split('=')[1]
      const data = parts[2].split(',')[1]
      console.log("type of data: " + typeof(data))
      console.log("top of data: " + JSON.stringify(data).substring(0,100))
      console.log("data size: " + data.length)
      const endpoint = "http://localhost:4001/graphql/";
      const SCAN_MUTATION = gql`
         mutation {
            scanImage(data:"${data}") {
                text
            }
         }
      `;
      
      console.log("going in")
      const response = await request(endpoint, SCAN_MUTATION)
      .then((data) => console.error(data))
      .catch((err) => console.error(err));
      console.log("going out")

      setTextResponse(JSON.stringify(response))

      setProgress('uploaded')
    } catch (error) {
      console.log("error in scan: " + error.message)
      setErrorMessage(error.message)
      setProgress('uploadError')
    }

  }
  const content = () => {
    switch(progress){
      case 'getUpload':
        return <UploadComponent onImage={onImage} />
      case 'uploading':
        return <h2>uploading...</h2>
      case 'uploaded':
        return <div>Text response  {textResponse} </div>
      case 'uploadError':
        return (
          <>
            <div>Error Message = {errorMessage} </div>
            <div>please upload an image</div>
          </>
        )
    }
  }
  return (
    <div className='App'>
      <h1>Text Scanner Website </h1>
      {content()}
    </div>
  )

}

export default App;
