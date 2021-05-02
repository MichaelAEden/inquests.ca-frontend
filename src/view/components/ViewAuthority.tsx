import React, { useState } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';

import Section from './Section';
import { Table, Row } from './Table';
import { InquestInternalLinks, AuthorityInternalLinks } from './InternalLinks';
import MissingDocumentDialog from './MissingDocumentDialog';
import { fetchJson } from 'common/utils/request';
import { getDateString, getYear } from 'common/utils/date';
import LoadingPage from 'common/components/LoadingPage';
import { Authority, AuthorityDocument } from 'common/models';

const useStyles = makeStyles((theme) => ({
  layout: {
    marginTop: theme.spacing(6),
  },
  headerSection: {
    marginLeft: theme.spacing(2),
  },
  primary: {
    color: theme.palette.secondary.main,
  },
  // Adds anchor styling to anchor elements without href attribute.
  modalLink: {
    cursor: 'pointer',
  },
}));

const HeaderSection = ({ authority, classes }: { authority: Authority; classes: any }) => {
  const primaryDocument = _.find(
    authority.authorityDocuments,
    (doc) => doc.isPrimary
  ) as AuthorityDocument;

  // TODO: remove extra whitespace between fields when one field is undefined.
  return (
    <div className={classes.headerSection}>
      <Typography variant="h5" component="h1">
        {authority.name}
      </Typography>
      {authority.isPrimary ? (
        <Typography className={classes.primary} variant="h6" component="h2">
          Key Case
        </Typography>
      ) : null}
      <Typography variant="h6" component="h2" gutterBottom>
        {primaryDocument.citation}
        <br />
        {primaryDocument.source.name}
        <br />
        {primaryDocument.created && getDateString(primaryDocument.created)}
      </Typography>
    </div>
  );
};

const DetailsSection = ({ authority }: { authority: Authority }) => (
  <Section header="Details">
    <Table>
      <Row name="Overview">{authority.overview}</Row>
      <Row name="Synopsis">{authority.synopsis}</Row>
      <Row name="Commentary">{authority.notes}</Row>
      <Row name="Quotes">{authority.quotes}</Row>
    </Table>
  </Section>
);

// TODO: display document type.
// TODO: is it safe to have a user-inputted href?
const DocumentsSection = ({
  documents,
  classes,
}: {
  documents: AuthorityDocument[];
  classes: any;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const renderDocuments = (docs: AuthorityDocument[]) =>
    docs.map((doc, i) => (
      <span key={i}>
        {doc.source.code}
        {doc.created && `, ${getYear(doc.created)}`} &mdash; <em>{doc.citation}</em> &mdash;{' '}
        {doc.authorityDocumentLinks.length ? (
          doc.authorityDocumentLinks.map((docLink, j) => (
            <span key={j}>
              <MuiLink href={docLink.link}>
                {docLink.documentSourceId === 'INQUESTS_CA'
                  ? 'View PDF'
                  : `View on ${docLink.documentSource.name}`}
              </MuiLink>
              {j !== doc.authorityDocumentLinks.length - 1 ? ', ' : null}
            </span>
          ))
        ) : (
          <MuiLink className={classes.modalLink} onClick={handleDialogOpen}>
            No Document Link
          </MuiLink>
        )}
        <br />
      </span>
    ));

  const primaryDoc = documents.filter((doc) => doc.isPrimary);
  const otherDocs = _.chain(documents)
    .filter((doc) => !doc.isPrimary)
    .sortBy('source.rank')
    .reverse()
    .value();

  return (
    <>
      <Section header="Documents">
        {!otherDocs.length ? (
          renderDocuments(primaryDoc)
        ) : (
          <Table>
            <Row name="Primary">{renderDocuments(primaryDoc)}</Row>
            <Row name="Other">{renderDocuments(otherDocs)}</Row>
          </Table>
        )}
      </Section>
      <MissingDocumentDialog onClose={handleDialogClose} open={dialogOpen} />
    </>
  );
};

const InternalLinksSection = ({ authority }: { authority: Authority }) => {
  const { inquests, authorityRelated, authorityCitations, authorityCitedBy } = authority;

  // Hide this section if the authority does not contain internal links.
  if (
    _.every(
      [inquests, authorityRelated, authorityCitations, authorityCitedBy],
      (arr) => !arr.length
    )
  )
    return null;

  return (
    <Section header="Related">
      <Table>
        {!!authorityCitations.length && (
          <Row name="Citations">
            <AuthorityInternalLinks authorities={authorityCitations} category="Citations" />
          </Row>
        )}
        {!!authorityCitedBy.length && (
          <Row name="Cited&nbsp;By">
            <AuthorityInternalLinks authorities={authorityCitedBy} category="Cited By" />
          </Row>
        )}
        {!!inquests.length && (
          <Row name="Related&nbsp;Inquests">
            <InquestInternalLinks inquests={inquests} category="Related Inquests" />
          </Row>
        )}
        {!!authorityRelated.length && (
          <Row name="See&nbsp;Also">
            <AuthorityInternalLinks authorities={authorityRelated} category="See Also" />
          </Row>
        )}
      </Table>
    </Section>
  );
};

const ViewAuthority = () => {
  const { authorityId } = useParams<{ authorityId: string }>();

  // TODO: on 404, redirect to homepage.
  const { data: authority } = useQuery(['authority', authorityId], (_key, authorityId: string) =>
    fetchJson<Authority>(`/authorities/${authorityId}`)
  );

  const classes = useStyles();

  if (!authority) return <LoadingPage />;

  return (
    <Container className={classes.layout}>
      <HeaderSection authority={authority} classes={classes} />
      <DetailsSection authority={authority} />
      <DocumentsSection documents={authority.authorityDocuments} classes={classes} />
      <InternalLinksSection authority={authority} />
    </Container>
  );
};

export default ViewAuthority;
