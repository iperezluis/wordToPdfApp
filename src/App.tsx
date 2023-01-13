import React, { ChangeEvent, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Box, Button, Typography } from "@mui/material";
import { PictureAsPdf, UploadFile } from "@mui/icons-material";

import formidable from "formidable";
import wordApi from "./api/wordApi";

const App = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [pdf, setPdf] = useState<Blob | null>(null);

  //?En esta caso no puedes usar Lambda Functions para usar Formidable ya que necesitarias
  //? adjuntarle un EFS(Elastic File System) y a la vez montar ese File Symten en una instancia ec2
  // ?para que puedas usar ese File System

  //!Por ejemplo puedes usar El file System de la instancia de ocheaper cuando este arrancando pero deberas
  // !adjuntarle una EFS a parte del EBS que ya tiene montado y ya serian doble costo adicional mensual

  // import * as fs from "fs"; --> para usar en servidores no puedes acceder al Fyle System en Frontend porque no hay un volumen, ni particiones, ni  file system
  //Dowload PDF
  // const startDownloadFile = () => {
  //   let file_path = `/articles/${article.name_path}`;
  //   let a = document.createElement("a");
  //   a.href = file_path;
  //   a.download = file_path.substring(file_path.lastIndexOf("/") + 1);
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // };

  const handleFileSelect = async ({
    target,
  }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }
    // console.log("buscando filepath", target.files[0]);
    // console.log("esto lo que retorna el file[0]", target.files[0]);
    try {
      for (const file of target.files) {
        const formData = new FormData();
        formData.append("file", file);
        //we send document to Lambda function serverless
        const { data } = await wordApi.post<{ file: formidable.File }>(
          "/",
          formData
        );
        //la funcion lambda va a retornar el file del formidable
        // saveFile(data.file);
        // setImage(data.message);
      }
    } catch (error) {
      console.log(error);
    }
    setFile(target.files![0]);
  };

  const handleFileConvert = () => {
    const reader = new FileReader();

    reader.onload = function (e: ProgressEvent<FileReader>) {
      const doc: jsPDF = new jsPDF();
      console.log("doc:", doc);
      console.log("file reader event:", e);
      // console.log(e.target?.result);
      // doc.

      doc.text(e.target!.result as string, 10, 10);
      setPdf(doc.output("blob"));
    };
    console.log("este es el PDF result:", pdf);
    // console.log(reader.result);

    reader.readAsText(file!);
  };

  return (
    <div>
      <Typography
        variant="h1"
        component="h1"
        fontSize={40}
        fontWeight={200}
        style={{ display: "flex", justifyContent: "center" }}
      >
        Convert Word Documents to PDF
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: "column", sm: "column" } }}
      >
        {/* <Typography variant="h6" component="h6" fontSize={70} fontWeight={200}>
          404 |
        </Typography>
        <Typography fontSize={20}>
          No encontramos ninguna pagina aqui
        </Typography> */}
        <Button
          fullWidth
          color="primary"
          onClick={() => inputFileRef.current?.click()}
          startIcon={<UploadFile />}
        >
          Upload Word Document
        </Button>
        <input
          type="file"
          onChange={(e) => handleFileSelect(e)}
          accept=".doc,.docx"
          ref={inputFileRef}
          style={{ display: "none" }}
        />
        <Button
          fullWidth
          color="secondary"
          onClick={handleFileConvert}
          startIcon={<PictureAsPdf />}
          style={{ marginTop: 15 }}
        >
          Convert to PDF
        </Button>
        {pdf && (
          <Button
            fullWidth
            color="secondary"
            // onClick={startDownloadFile}
            startIcon={<PictureAsPdf />}
            style={{ marginTop: 15 }}
          >
            Download PDF
          </Button>
        )}
      </Box>
    </div>
  );
};

export default App;
