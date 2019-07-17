import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { fetchNoAuth } from '../../../common/services/fetchHelper';

const useStyles = makeStyles(theme => ({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  progress: {
    marginTop: theme.spacing(4)
  }
}));

export default function AuthorityTable(props) {
  const [authorities, setAuthorities] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const { className } = props;

  const fetchInquests = async () => {
    setIsFetching(true);
    const response = await fetchNoAuth('/api/inquests');
    if (response.ok) {
      let json;
      try {
        json = await response.json();
      } catch (e) {
        return;
      }
      setIsFetching(false);
      setAuthorities(json);
    }
  };

  useEffect(() => {
    if (!authorities && !isFetching) fetchInquests();
  });

  const classes = useStyles();

  return (
    <div className={clsx(className, classes.layout)}>
      {authorities && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authorities.map((authority, i) => (
                <TableRow key={i}>
                  <TableCell>{authority.title}</TableCell>
                  <TableCell>{authority.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      {isFetching && <CircularProgress className={classes.progress} />}
    </div>
  );
}