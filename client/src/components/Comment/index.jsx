import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Link } from "react-router-dom";
import {
  addComment,
  cancelUpdatingComment,
  deleteComment,
  getComments,
  updateComment,
  updatingComment,
} from "../../redux/articleSlice";

const index = ({ articleId }) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.article.comments);
  const { id: userId } = useAppSelector((state) => state.user.user);
  const themeColor = useAppSelector((state) => state.theme.color);
  useEffect(() => {
    (async () => {
      await dispatch(getComments({ articleId }));
    })();
  }, [articleId]);
  const [comment, setComment] = useState("");
  const [openDeleteComment, setOpenDeleteComment] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState({
    commentId: null,
    content: "",
    indexComment: null,
  });

  const open = Boolean(anchorEl);
  const onChangeComment = (e) => {
    setComment(e.target.value);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event, { index, comment }) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu({
      ...openMenu,
      commentId: comment.id,
      indexComment: index,
      content: comment.content,
    });
  };
  const keyPress = async (e) => {
    if (e.key === "Enter" && comment) {
      await dispatch(addComment({ articleId, content: comment }));

      setComment("");
    }
  };

  const handleSendComment = async () => {
    await dispatch(addComment({ articleId, content: comment }));

    setComment("");
  };

  const handleUpdateComment = async (index) => {
    await dispatch(updatingComment(index));
    handleClose();
  };

  const handleCloseUpdating = async (index) => {
    await dispatch(cancelUpdatingComment(index));
  };

  const handleOKUpdating = async (commentId, content, index) => {
    if (content) {
      await dispatch(updateComment({ commentId, content, index }));
    }
  };

  const handleEnterUpdating = async (e, { commentId, content, index }) => {
    if (content) {
      if (e.key === "Enter" && content) {
        await dispatch(updateComment({ commentId, content, index }));
      }
    }
  };

  const handleDeleteComment = async () => {
    await dispatch(
      deleteComment({
        articleId,
        commentId: openMenu.commentId,
        index: openMenu.indexComment,
      })
    );
    setOpenDeleteComment(false);
  };

  return (
    <>
      <Box
        height={"75%"}
        borderTop={`1px solid ${
          themeColor === "light" ? "#a6aeb8" : "#2d3748"
        }`}
        sx={{
          overflowY: "scroll",

          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#fff",
            borderRadius: "5px",
            outline: "1px solid slategrey",
          },
        }}
      >
        {comments.map((comment, index) => {
          return (
            <div
              key={comment.id}
              style={{
                display: "flex",
                margin: "10px",
                maxWidth: "80%",
              }}
            >
              <Link
                to={
                  userId === comment.userId
                    ? "/profile"
                    : `../user/${comment.userId}`
                }
                onClick={() => handleClickUser()}
              >
                <Avatar
                  src={comment?.user.avatar}
                  aria-label="recipe"
                  sx={{ width: "35px", height: "35px" }}
                />
              </Link>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "#E4E6EB",
                  width: "auto",
                  padding: "0px 10px",
                  marginLeft: "5px",
                  borderRadius: "10px",
                }}
              >
                <Link
                  to={
                    userId === comment.userId
                      ? "/profile"
                      : `../user/${comment.userId}`
                  }
                  style={{
                    color: "black",
                    textDecoration: "none",
                    ":hover": {
                      color: "red",
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => handleClickUser()}
                >
                  <Typography
                    variant="i"
                    sx={{
                      ":hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {comment.user?.firstName + " " + comment.user?.lastName}
                  </Typography>
                </Link>
                {comment?.updatingComment ? (
                  <>
                    <TextField
                      variant="standard"
                      sx={{ display: "block" }}
                      defaultValue={openMenu.content}
                      value={openMenu.content}
                      onChange={(e) => {
                        setOpenMenu({ ...openMenu, content: e.target.value });
                      }}
                      onKeyDown={(e) => {
                        handleEnterUpdating(e, {
                          commentId: comment.id,
                          content: openMenu.content,
                          index: openMenu.indexComment,
                        });
                      }}
                    />
                    <Box display={"flex"}>
                      <Button
                        sx={{ textTransform: "none", color: "black" }}
                        onClick={() =>
                          handleCloseUpdating(openMenu.indexComment)
                        }
                      >
                        Cancel
                      </Button>
                      <Button
                        sx={{}}
                        onClick={() =>
                          handleOKUpdating(
                            comment.id,
                            openMenu.content,
                            openMenu.indexComment
                          )
                        }
                      >
                        OK
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "15px", color: "black" }}
                  >
                    {comment.content}
                  </Typography>
                )}

                <Box
                  position={"absolute"}
                  right={"-50px"}
                  top={"0"}
                  sx={{
                    display: `${comment.userId === userId ? "block" : "none"}`,
                  }}
                >
                  <IconButton
                    onClick={(event) =>
                      handleClick(event, {
                        index,
                        comment,
                      })
                    }
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </Box>
              </div>
            </div>
          );
        })}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => handleUpdateComment(openMenu.indexComment)}>
            Update
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenDeleteComment(true);
              handleClose();
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          marginLeft: "5px",
        }}
      >
        <TextField
          sx={{
            width: "100%",
            "& input": {
              color: `${themeColor === "light" ? "#1A2027" : "#fff"}`,
            },

            // color: "white",
          }}
          //   color={`${themeColor === "light" ? "#1A2027" : "#fff"}`}
          // id="input-with-sx"
          variant="standard"
          value={comment}
          onChange={onChangeComment}
          onKeyDown={keyPress}
          placeholder="Viết bình luận"
        />
        <IconButton onClick={async () => await handleSendComment()}>
          <SendIcon sx={{ color: "#1976d2" }} />
        </IconButton>
      </Box>
      <Dialog
        open={openDeleteComment}
        onClose={() => !openDeleteComment}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Article</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteComment(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteComment} sx={{ textTransform: "none" }}>
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default index;
