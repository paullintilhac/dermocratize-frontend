import './App.css';
import ImageUploader from 'react-images-upload'
import React, { useState } from "react"
import Axios from 'axios'


const UploadComponent = props => (
  <form>
    <label>
      File Upload URL:
      <input id='urlInput' type='text' onChange={props.onUrlChange} value={props.url}></input>
      <ImageUploader
        key='image-uploader'
        withIcon={true}
        singleImage={true}
        withPreview={true}
        label='Maximum Size File: 5mb'
        buttonText='Choose an Image'
        onChange={props.onImage}
        imgExtension={['.jpg', '.png', '.jpeg']}
        maxFileSize={5242880}
      ></ImageUploader>
    </label>
  </form>
)

const App = () => {

  const [progress, setProgress ] = useState('getUpload')
  const [errorMessage, setErrorMessage ] = useState('')
  const [url, setImageURL ] = useState('')

  const onUrlChange = e => {
    setImageURL(e.target.value)
  }

  const onImage = async (failedImages, successImages) => {
    if (!url){
      console.log("missing url")
      setErrorMessage('missing url to point to')
      setProgress('uploadError')
      return
    }

    setProgress('uploading')

    try {
      console.log('successImages', successImages)
      const parts = successImages[0].split(';')
      const mime = parts[0].split(':')[1]
      const name = parts[1].split('=')[1]
      const data = parts[2]
      const res = await Axios.post(url, {mime, name, image:data})
      setImageURL(res.data.imageURL)
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
        return <UploadComponent onUrlChange={onUrlChange} onImage={onImage} url={url} />
      case 'uploading':
        return <h2>uploading...</h2>
      case 'uploaded':
        return <img src={url} alt = "uploaded"></img>
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
