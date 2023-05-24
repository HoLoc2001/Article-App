import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  addBookmark,
  getArticleByArticleId,
  updateLike,
} from "../../redux/articleSlice";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import { follow, getHasFollow } from "../../redux/userSlice";
import { removeBookmark } from "../../redux/articleSlice";
import AlertInfo from "../AlertInfo";
import Comment from "../Comment";

const ReadArticle = () => {
  const dispatch = useAppDispatch();
  const { articleId } = useParams();
  const themeColor = useAppSelector((state) => state.theme.color);
  const isSuccessAuth = useAppSelector((state) => state.auth.isAuthenticated);
  const { id: userId } = useAppSelector((state) => state.user.user);
  const article = useAppSelector((state) => state.article.article);
  const { isFollowed } = useAppSelector((state) => state.user.authorPost);
  const [errMissInput, setErrMissInput] = useState(false);
  useEffect(() => {
    (async () => {
      await dispatch(getArticleByArticleId(articleId));
    })();
  }, []);

  useEffect(() => {
    if (article) {
      (async () => {
        await dispatch(getHasFollow({ userId: article.user.id }));
      })();
    }
  }, [article]);

  const handleFollow = async (userId) => {
    if (!isSuccessAuth) return setErrMissInput(true);

    await dispatch(follow({ userId }));
  };

  if (articleId != article?.id) {
    return (
      <>
        <Box display={"flex"}>
          <Stack spacing={1}>
            <Skeleton
              variant="text"
              sx={{
                fontSize: "3.75rem",
                backgroundColor: "#293241",
                width: "55vw",
              }}
            />

            <Skeleton
              variant="rounded"
              sx={{
                height: "1000px",
                width: "55vw",
                backgroundColor: "#293241",
              }}
            />
          </Stack>
          <Stack spacing={1} marginLeft={"40px"} marginTop={"20px"}>
            <Skeleton
              variant="rounded"
              sx={{
                height: "25vh",
                backgroundColor: "#293241",
                width: "26vw",
                marginBottom: "22.225px",
              }}
            />

            <Skeleton
              variant="rounded"
              sx={{
                height: "53vh",
                width: "26vw",
                backgroundColor: "#293241",
              }}
            />
          </Stack>
        </Box>
      </>
    );
  }

  const handleLike = async (e, { articleId }) => {
    e.preventDefault();

    if (!isSuccessAuth) return setErrMissInput(true);
    await dispatch(updateLike(articleId));
  };

  const handleClickComment = (e) => {
    e.preventDefault();

    if (!isSuccessAuth) return setErrMissInput(true);
  };

  const handleAddBookmark = async (event, { articleId }) => {
    event.preventDefault();

    if (!isSuccessAuth) {
      return setErrMissInput(true);
    }
    await dispatch(addBookmark({ articleId }));
  };

  const handleRemoveBookmark = async (event, { articleId, article }) => {
    event.preventDefault();

    if (!isSuccessAuth) {
      return setErrMissInput(true);
    }
    await dispatch(removeBookmark({ articleId, article }));
  };

  const handleClick = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <Box display={"flex"}>
        <Box
          sx={{
            width: "65%",
            minWidth: "65%",
          }}
        >
          <Typography variant="h2">{article?.title}</Typography>
          <Box display={"flex"}>
            {article?.tags.map((tag) => {
              return (
                <Link
                  to={`../tag/${tag.name}`}
                  style={{
                    marginRight: "7px",
                    textDecoration: "none",
                    color: `${themeColor === "light" ? "#1A2027" : "#fff"}`,
                  }}
                  key={tag.name}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      ":hover": {
                        backgroundColor: `${
                          themeColor === "light"
                            ? "#e2e3f3"
                            : "rgba(45,50,59,255)"
                        }`,
                        color: `${
                          themeColor === "light"
                            ? "#1A2027"
                            : "rgba(249,242,222,255)"
                        }`,
                        borderRadius: "5px",
                      },
                    }}
                  >
                    #{tag.name}
                  </Typography>
                </Link>
              );
            })}
          </Box>

          <div
            style={{ overflow: "hidden" }}
            dangerouslySetInnerHTML={{ __html: article?.content }}
          />
          <Typography color={"#ff000000"}>a</Typography>
        </Box>
        <Box
          position={"fixed"}
          // right={"0"}
          left={"70vw"}
          sx={{
            width: "29vw",
            // marginLeft: "20px",
            borderLeft: `0.1px solid ${
              themeColor === "light" ? "#a6aeb8" : "#2d3748"
            }`,
          }}
        >
          <Box
            sx={{
              m: "5% 5% ",
              borderRadius: "10px",
              border: `${themeColor === "light" ? "1px solid #e9e9e9" : ""}`,
              height: "25vh",
              backgroundColor: `${themeColor === "light" ? "#fff" : "#2d3748"}`,
            }}
          >
            <Box p={"10px 0 0 10px"} m={`0 calc(50% - 35px )`}>
              <Link
                to={
                  userId === article.userId
                    ? "/profile"
                    : `../user/${article.userId}`
                }
              >
                <Tooltip
                  title={article.user?.firstName + " " + article.user?.lastName}
                >
                  <Avatar
                    sx={{ marginRight: "5px", width: "50px", height: "50px" }}
                    src={article.user?.avatar}
                  />
                </Tooltip>
              </Link>
            </Box>
            <Box textAlign={"center"}>
              <Link
                to={
                  userId === article.userId
                    ? "/profile"
                    : `../user/${article.userId}`
                }
                style={{
                  textDecoration: "none",
                  color: `${themeColor === "light" ? "#2d3748" : "#fff2f2"}`,
                }}
              >
                <Typography variant="h6">
                  {`${article.user?.firstName} ${article.user?.lastName}`}
                </Typography>
              </Link>
              <Button
                onClick={() => handleFollow(article.user.id)}
                sx={{
                  marginTop: "30px",
                  marginBottom: "30px",
                  minWidth: "60%",
                  textTransform: "none",

                  backgroundColor: `${isFollowed ? "#ffffff" : "#3b49df"}`,
                  border: `${isFollowed ? "1px solid #a3a3a3" : ""}`,
                  ...(isFollowed
                    ? {
                        color: `${
                          themeColor === "light" ? "#3d3d3d" : "#3d3d3d"
                        }`,
                      }
                    : {
                        color: `${
                          themeColor === "light" ? "#f9f9f9" : "#090909"
                        }`,
                      }),
                  ":hover": {
                    backgroundColor: `${isFollowed ? "#a3a3a3" : "#2f3ab2"}`,
                  },
                }}
              >
                {isFollowed ? "Following" : "Follow"}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              m: "5% 5% ",
              borderRadius: "10px",
              border: `${
                themeColor === "light"
                  ? "1px solid #e9e9e9"
                  : "1px solid #2d3748"
              }`,
              height: "55vh",
              backgroundColor: `${themeColor === "light" ? "#fff" : "#2d3748"}`,
            }}
          >
            <Box>
              <Grid item xs={12}>
                <Grid
                  container
                  justifyContent="center"
                  spacing={12}
                  // color={"rgb(245 245 245)"}
                >
                  <Grid key={1} item display={"flex"} alignItems={"center"}>
                    <Tooltip title="Like">
                      <IconButton
                        sx={{
                          color: `${
                            themeColor === "light" ? "" : "rgb(245 245 245)"
                          }`,
                          ":hover": {
                            backgroundColor: `${
                              themeColor === "light" ? "#e2e3f3" : "#5c5d5f"
                            }`,
                            color: `${
                              themeColor === "light"
                                ? ""
                                : "rgba(249,242,222,255)"
                            }`,
                          },
                        }}
                        onClick={(event) =>
                          handleLike(event, {
                            articleId: article.id,
                          })
                        }
                      >
                        {article.isLiked ? (
                          <FavoriteIcon sx={{ color: "red" }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Typography>{article._count?.likes}</Typography>
                  </Grid>
                  <Grid key={2} item display={"flex"} alignItems={"center"}>
                    <Tooltip title="Comment">
                      <IconButton
                        sx={{
                          color: `${
                            themeColor === "light" ? "" : "rgb(245 245 245)"
                          }`,
                          ":hover": {
                            backgroundColor: `${
                              themeColor === "light" ? "#e2e3f3" : "#5c5d5f"
                            }`,
                            color: `${
                              themeColor === "light"
                                ? ""
                                : "rgba(249,242,222,255)"
                            }`,
                          },
                        }}
                        onClick={handleClickComment}
                      >
                        <CommentIcon />
                      </IconButton>
                    </Tooltip>
                    <Typography>{article._count?.comments}</Typography>
                  </Grid>
                  <Grid key={3} item>
                    {article.isBookmarked ? (
                      <Tooltip title="Remove bookmark">
                        <IconButton
                          sx={{
                            color: `${
                              themeColor === "light" ? "" : "rgb(245 245 245)"
                            }`,
                            ":hover": {
                              backgroundColor: `${
                                themeColor === "light" ? "#e2e3f3" : "#5c5d5f"
                              }`,
                              color: `${
                                themeColor === "light"
                                  ? ""
                                  : "rgba(249,242,222,255)"
                              }`,
                            },
                          }}
                          onClick={(event) =>
                            handleRemoveBookmark(event, {
                              articleId: article.id,

                              article,
                            })
                          }
                        >
                          <BookmarkRemoveIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Add bookmark">
                        <IconButton
                          sx={{
                            color: `${
                              themeColor === "light" ? "" : "rgb(245 245 245)"
                            }`,
                            ":hover": {
                              backgroundColor: `${
                                themeColor === "light" ? "#e2e3f3" : "#5c5d5f"
                              }`,
                              color: `${
                                themeColor === "light"
                                  ? ""
                                  : "rgba(249,242,222,255)"
                              }`,
                            },
                          }}
                          onClick={(event) =>
                            handleAddBookmark(event, {
                              articleId: article.id,
                            })
                          }
                        >
                          <BookmarkAddIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Comment articleId={article.id} />
          </Box>
        </Box>
      </Box>
      <AlertInfo
        err={errMissInput}
        setErr={setErrMissInput}
        severity="info"
        content="Please login"
      />
    </>
  );
};

export default ReadArticle;
