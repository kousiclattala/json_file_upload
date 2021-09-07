import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const url = "http://localhost:5000";

  const [file, setFile] = useState("");
  // const [files, setFiles] = useState({});
  const [files, setFiles] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(file);

    const formData = new FormData();
    formData.append("myFile", file);

    try {
      const res = await axios.post(`${url}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  //TODO: Convert base64 string to Image and display it in the browser.
  const b64toFile = (base64, filename) => {
    let arr = base64.split(","),
      mime = arr[0].match(/:(.*?);/),
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const getAllFiles = async () => {
    try {
      const res = await axios.get(`${url}/`);

      const myBase64 = res.data;
      const fileName = "test";

      const convertedFile = b64toFile(myBase64, fileName);

      console.log(convertedFile);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllFiles();
  });

  return (
    <div className="container container-fluid">
      <h1 className="text-center text-primary">Hello Alien</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            name="myFile"
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit" className="btn btn-primary">
            Upload
          </button>
        </div>
      </form>

      {/* {files.length === 0 ? (
        <>
          <p className="text-center">No Posts to show</p>
        </>
      ) : (
        <div className="container">
          {Object.keys(files).map((file) => (
            <div className="card card-body mt-3">
              <img src={file} />
            </div>
          ))}
        </div>
      )} */}

      <div className="card card-body">
        <img src={files} />
      </div>
    </div>
  );
};

export default App;
