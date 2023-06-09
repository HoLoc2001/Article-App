import React, { useEffect, useState } from "react";
import SunEditor, { buttonList } from "suneditor-react";
import {
  align,
  font,
  fontColor,
  fontSize,
  formatBlock,
  hiliteColor,
  horizontalRule,
  lineHeight,
  list,
  paragraphStyle,
  table,
  template,
  textStyle,
  image,
  link,
} from "suneditor/src/plugins";
import "suneditor/dist/css/suneditor.min.css";
import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getTags } from "../../redux/tagSlice";
import { addImage } from "../../redux/cloudSlice";
import Navbar from "../../layouts/Navbar";
import { getBase64 } from "../../utils";
import { articleValidate } from "../../utils/validation";
import {
  addArticle,
  getArticleByArticleId,
  updateArticle,
} from "../../redux/articleSlice";
import { Link, useParams } from "react-router-dom";
import AlertInfo from "../AlertInfo";

const CssTextField = styled(TextField)({
  root: {
    "& label.Mui-focused": {
      color: "#1A2027",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "yellow",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#1A2027",
      },
      "&:hover fieldset": {
        borderColor: "#1A2027",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1A2027",
      },
    },
  },
});

const UpdateArticle = () => {
  const dispatch = useAppDispatch();
  const { articleId } = useParams();
  useEffect(() => {
    (async () => {
      await dispatch(getArticleByArticleId(articleId));
      await dispatch(getTags());
    })();
  }, []);

  const tagsList = useAppSelector((state) => state.tag.tags);
  const article = useAppSelector((state) => state.article.article);
  const [errMissInput, setErrMissInput] = useState(false);
  const [content, setContent] = useState("");
  const [articleForm, setArticleForm] = useState({
    title: "",
    thumbnailUrl: "",
    thumbnailBase64: "",
    tags: [],
  });
  useEffect(() => {
    setArticleForm({
      title: article?.title || "",
      thumbnailUrl: article?.thumbnail || "",
      thumbnailBase64: article?.thumbnail || "",
      tags: article?.tags || [],
    });
    setContent(article?.content || "");
  }, [article]);

  const { title, thumbnailUrl, thumbnailBase64, tags } = articleForm;

  function handleChange(content) {
    setContent(content);
  }

  function handleChangeTitle(e) {
    setArticleForm({ ...articleForm, title: e.target.value });
  }

  function handleChangeTags(e, tags) {
    // let result = tags.map(({ name }) => name);

    return setArticleForm({ ...articleForm, tags });
  }

  const handleImageUploadBefore = async (files, info, core, uploadHandler) => {
    const formData = new FormData();
    formData.append("file", files[0], "file");

    const {
      payload: {
        data: { secure_url },
      },
    } = await dispatch(addImage(formData));

    const response = {
      result: [
        {
          url: secure_url,
          name: "hello world",
        },
      ],
    };
    uploadHandler(response);
  };

  const handleUpdateArticle = async (e) => {
    const { error } = articleValidate({
      title,
      thumbnail: thumbnailUrl,
      tags,
      content,
    });
    if (error) {
      e.preventDefault();
      console.log(error);
      setErrMissInput(true);
    } else {
      let result = tags.map(({ name }) => name);
      await dispatch(
        updateArticle({
          articleId,
          title,
          thumbnail: thumbnailUrl,
          tags: result,
          content,
        })
      );
    }
  };

  const handleFileUpload = async (e) => {
    try {
      let thumbnail = new FormData();
      thumbnail.append("file", e.target.files[0], "file");

      const base64 = await getBase64(e.target.files[0]);
      setArticleForm({
        ...articleForm,
        thumbnailBase64: base64,
      });

      const {
        payload: {
          data: { url },
        },
      } = await dispatch(addImage(thumbnail));

      setArticleForm({
        ...articleForm,
        thumbnailBase64: base64,
        thumbnailUrl: url,
      });
    } catch (error) {}
  };

  return (
    <>
      <Navbar notShowCreate={true} />

      <Stack
        component="form"
        m={"2%"}
        sx={{
          backgroundColor: "#fff",
          color: "rgb(255 242 242)",
        }}
        spacing={3}
        noValidate
      >
        <CssTextField
          onChange={handleChangeTitle}
          label="Title"
          fullWidth={true}
          value={title}
        />

        <Box marginBottom={"10px"}>
          <Button
            component="label"
            sx={{
              textTransform: "none",
              border: "1px solid #a3a3a3",
              color: "black",
            }}
          >
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileUpload}
            />
            Add thumbnail
          </Button>
        </Box>
        <img
          style={{
            display: `${thumbnailBase64 ? "block" : "none"}`,
            width: "320px",
            height: "200px",
            objectFit: "contain",
            borderRadius: "5px",
          }}
          src={thumbnailBase64}
        />

        <Autocomplete
          multiple
          limitTags={5}
          id="multiple-limit-tags"
          options={tagsList}
          onChange={handleChangeTags}
          value={articleForm.tags}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          // defaultValue={articleForm?.tags}
          getOptionLabel={(option) => {
            return option.name;
          }}
          renderInput={(params) => {
            return <TextField {...params} placeholder="Add Tag" />;
          }}
          // onChange={(event, value) => console.log(value)}
          sx={{
            maxWidth: "100%",
            minHeight: "60px",
            marginBottom: "10px",
            backgroundColor: "#fff",
            color: "rgb(255 242 242)",
          }}
        />
        <SunEditor
          name="my-editor"
          setAllPlugins={true}
          setOptions={{
            showPathLabel: false,
            minHeight: "60vh",
            maxWidth: "100%",
            maxHeight: "60vh",

            placeholder: "Enter your text here!!!",

            plugins: [
              align,
              font,
              fontColor,
              fontSize,
              formatBlock,
              hiliteColor,
              horizontalRule,
              lineHeight,
              list,
              paragraphStyle,
              table,
              template,
              textStyle,
              image,
              link,
            ],
            buttonList: [
              ["undo", "redo"],
              ["font", "fontSize", "formatBlock"],
              ["paragraphStyle"],
              [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
              ],
              ["fontColor", "hiliteColor"],
              ["removeFormat"],
              "/", // Line break
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "lineHeight"],
              ["table", "link", "image"],
            ],
            formats: ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
            font: [
              "Arial",
              "Calibri",
              "Comic Sans",
              "Courier",
              "Garamond",
              "Georgia",
              "Impact",
              "Lucida Console",
              "Palatino Linotype",
              "Segoe UI",
              "Tahoma",
              "Times New Roman",
              "Trebuchet MS",
            ],
          }}
          onChange={handleChange}
          setContents={content}
          onImageUploadBefore={handleImageUploadBefore}
        />
      </Stack>
      <Link
        to={"../profile"}
        style={{ textDecoration: "none" }}
        onClick={handleUpdateArticle}
      >
        <Button
          sx={{
            width: "200px",
            margin: "20px 0 20px calc(50vw - 100px)",
            textTransform: "none",
            backgroundColor: "rgb(255 248 248)",
            border: "1px solid #a3a3a3",
            color: "#171717",
          }}
        >
          Update Article
        </Button>
      </Link>
      <AlertInfo
        err={errMissInput}
        setErr={setErrMissInput}
        severity="warning"
        content="Please fill it out completely"
      />
    </>
  );
};

export default UpdateArticle;
