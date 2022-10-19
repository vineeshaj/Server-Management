import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { useStyles } from "./BodyComponent/BodyStyles";
import FavoriteIcon from "@material-ui/icons/Favorite";

export default function FooterComponent() {
  const classes = useStyles();
  return (
    <Box className={classes.footer}>
      <Grid container>
        {/* <Grid item xs={12} sm={6}>
          <Typography variant="body1" color="textSecondary" align="center">
          </Typography>
        </Grid> */}
            {/* Created With and affection <FavoriteIcon color='secondary' /> */}
        <Grid item xs={12} sm={12}>
          <Typography variant="body1" color="textSecondary" align="center" className="footerText">
          ©2022 Infobellit Pvt.Ltd.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
