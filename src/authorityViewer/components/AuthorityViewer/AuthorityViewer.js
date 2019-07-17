import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import AuthorityTable from '../AuthorityTable';

const useStyles = makeStyles(theme => ({
  layout: {
    marginTop: theme.spacing(14),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  subtitle: {
    marginTop: theme.spacing(2)
  },
  table: {
    marginTop: theme.spacing(4)
  }
}));

export default function AuthorityViewer() {
  const classes = useStyles();

  return (
    <Container maxWidth="xs" className={classes.layout}>
      <Typography variant="h2">Inquests.ca</Typography>
      <Typography variant="h6" className={classes.subtitle}>
        The guide to Canadian inquest authorities
      </Typography>
      <AuthorityTable className={classes.table} />
    </Container>
  );
}