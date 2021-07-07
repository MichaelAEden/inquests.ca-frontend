import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';

import Section from './Section';
import { Table, Row } from './Table';
import { AuthorityInternalLinks } from './InternalLinks';
import MissingDocumentDialog from './MissingDocumentDialog';
import { fetchJson } from 'common/utils/request';
import { getDateString } from 'common/utils/date';
import LoadingPage from 'common/components/LoadingPage';
import { Authority, Deceased, Inquest, InquestDocument } from 'common/models';

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

const HeaderSection = ({ inquest, classes }: { inquest: Inquest; classes: any }) => (
  <div className={classes.headerSection}>
    <Typography variant="h5" component="h1">
      {inquest.name}
    </Typography>
    {inquest.isPrimary ? (
      <Typography className={classes.primary} variant="h6" component="h2">
        Key Case
      </Typography>
    ) : null}
    <Typography variant="h6" component="h2" gutterBottom>
      {inquest.jurisdiction.name}
      <br />
      {getDateString(inquest.start)}
      {inquest.end ? ` - ${getDateString(inquest.end)}` : ''}
    </Typography>
  </div>
);

const DetailsSection = ({ inquest }: { inquest: Inquest; classes: any }) => (
  <Section header="Details">
    <Table>
      <Row name="Overview">{inquest.overview}</Row>
      <Row name="Synopsis">{inquest.synopsis}</Row>
      <Row name="Commentary">{inquest.notes}</Row>
      <Row name="Presiding&nbsp;Officer">{inquest.presidingOfficer}</Row>
      <Row name="Sitting Days">{inquest.sittingDays}</Row>
      <Row name="Exhibits">{inquest.exhibits}</Row>
    </Table>
  </Section>
);

const DeceasedSection = ({ deceasedList, classes }: { deceasedList: Deceased[]; classes: any }) => (
  <Section header="Deceased">
    {deceasedList.map((deceased, i) => (
      <div key={i}>
        <Typography variant="subtitle1" component="h4">
          {deceased.lastName || deceased.givenNames ? (
            `${deceased.lastName}, ${deceased.givenNames}`
          ) : (
            <span className={classes.metadata}>Name Withheld</span>
          )}
        </Typography>
        <Table>
          <Row compact name="Age">
            {deceased.age}
          </Row>
          <Row compact name="Sex">
            {deceased.sex}
          </Row>
          <Row compact name="Manner&nbsp;of&nbsp;Death">
            {deceased.deathManner.name}
          </Row>
          <Row compact name="Cause&nbsp;of&nbsp;Death">
            {deceased.deathCause}
          </Row>
          <Row compact name="Date&nbsp;of&nbsp;Death">
            {getDateString(deceased.deathDate)}
          </Row>
          <Row compact name="Reason&nbsp;for&nbsp;Inquest">
            {deceased.inquestReason.name}
          </Row>
        </Table>
        {i !== deceasedList.length - 1 ? <br /> : null}
      </div>
    ))}
  </Section>
);

// TODO: display other document data as needed (creation date).
// TODO: display document type.
// TODO: how to sort documents?
// TODO: is it safe to have a user-inputted href?
const DocumentsSection = ({
  documents,
  classes,
}: {
  documents: InquestDocument[];
  classes: any;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  return (
    <>
      <Section header="Documents">
        {documents.map((doc, i) => (
          <span key={i}>
            {doc.name} &mdash;{' '}
            {doc.inquestDocumentLinks.length ? (
              doc.inquestDocumentLinks.map((docLink, j) => (
                <span key={j}>
                  <MuiLink href={docLink.link}>
                    {docLink.documentSourceId === 'INQUESTS_CA'
                      ? 'View PDF'
                      : `View on ${docLink.documentSource.name}`}
                  </MuiLink>
                  {j !== doc.inquestDocumentLinks.length - 1 ? ', ' : null}
                </span>
              ))
            ) : (
              <MuiLink className={classes.modalLink} onClick={handleDialogOpen}>
                No Document Link
              </MuiLink>
            )}
            <br />
          </span>
        ))}
      </Section>
      <MissingDocumentDialog onClose={handleDialogClose} open={dialogOpen} />
    </>
  );
};

const InternalLinksSection = ({ authorities }: { authorities: Authority[] }) => {
  if (!authorities.length) return null;

  return (
    <Section header="Related Authorities">
      <AuthorityInternalLinks authorities={authorities} category="Related Authorities" />
    </Section>
  );
};

const ViewInquest = () => {
  const { inquestId } = useParams<{ inquestId: string }>();

  // TODO: on 404, redirect to homepage.
  const { data: inquest } = useQuery(['inquest', inquestId], (_key, inquestId: string) =>
    fetchJson<Inquest>(`/inquests/${inquestId}`)
  );

  const classes = useStyles();

  if (!inquest) return <LoadingPage />;

  return (
    <Container className={classes.layout}>
      <HeaderSection inquest={inquest} classes={classes} />
      <DetailsSection inquest={inquest} classes={classes} />
      <DeceasedSection deceasedList={inquest.deceased} classes={classes} />
      <DocumentsSection documents={inquest.inquestDocuments} classes={classes} />
      <InternalLinksSection authorities={inquest.authorities} />
    </Container>
  );
};

export default ViewInquest;
