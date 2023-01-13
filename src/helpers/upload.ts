import * as fs from "fs";
import formidable from "formidable";

const saveFile = (file: formidable.File) => {
  console.log("estos son datos del file:", file);
  //en este punto ya existe la carpeta fisica en el fileSystem
  const data = fs.readFileSync(file.filepath);
  // ahora hagamos la escritura y movimiento de ese archivo a una carpeta fisica
  fs.writeFileSync(`./public/${file.originalFilename}`, data);
  //ahora eliminamos para que no acumule archivos basura
  // fs.unlinkSync(file.filepath);
};
//el formidable qiue instalamos lo usamos aqui abajo para parsear los files antes de subir a cloudinary o almacenar en fileSYstem(no recomendado por next);
const parseFiles = (req: Request): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      console.log(err, fields, files);

      if (err) {
        return reject(err);
      }
      //aqui ya tenemos el secure_url que retornamos
      const filePath = await saveFile(files.file as formidable.File);
      console.log({ filePath });
      resolve(filePath);
    });
  });
};

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const imageUrl = await parseFiles(req);
  return res.status(200).json({
    message: imageUrl,
  });
};
