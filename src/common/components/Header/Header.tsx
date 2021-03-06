import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import NavButton from './NavButton';
import { reportNavigation } from 'common/utils/analytics';

const URL_TERMS_OF_USE = 'https://inquests-ca-resources.s3.amazonaws.com/TermsOfUse.pdf';
const URL_HELP = 'https://inquests-ca-resources.s3.amazonaws.com/Help.pdf';

const useStyles = makeStyles((theme) => ({
  navMenu: {
    backgroundColor: theme.palette.common.white,
  },
  // Removes default anchor styling from anchor elements.
  navReset: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  navHeader: {
    flexGrow: 1,
  },
  offset: theme.mixins.toolbar,
}));

const NavHeader = () => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="fixed" className={classes.navMenu}>
        <Toolbar>
          <Typography variant="h5" className={classes.navHeader}>
            <Link
              to="/"
              className={classes.navReset}
              onClick={() => reportNavigation({ location: 'Home' })}
            >
              Inquests.ca
            </Link>
          </Typography>
          <NavButton to={URL_TERMS_OF_USE} label="Terms of Use" location="Terms of Use" external />
          <NavButton to={URL_HELP} label="Help" location="Help" external />
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </>
  );
};

export default NavHeader;
