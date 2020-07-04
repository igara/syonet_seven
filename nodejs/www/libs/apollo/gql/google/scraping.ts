import gql from "graphql-tag";

export type ExecScraping = {
  execScraping: {
    html: string;
  };
};

export const EXEC_SCRAPING = gql`
  query ExecScraping($url: String!) {
    execScraping(url: $url) {
      html
    }
  }
`;

export type SaveScrapingHTML = {
  saveScrapingHTML: {
    driveID: string;
    html: string;
    url: string;
    title: string;
  };
};

export const SAVE_SCRAPING_HTML = gql`
  mutation SaveScrapingHTML($html: String!, $url: String!, $title: String!) {
    saveScrapingHTML(html: $html, url: $url, title: $title) {
      driveID
      html
      url
      title
    }
  }
`;
