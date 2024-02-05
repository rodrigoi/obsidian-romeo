import * as React from "react";

interface EmailTemplateProps {
  stories: Array<any>;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  stories = [
    {
      id: 1,
      url: "http://example.com",
      title: "this is a title",
    },
  ],
}) => (
  <div style={{ backgroundColor: "white" }}>
    <p>New Hacker News Job Stories</p>
    <ul>
      {stories.map((story) => (
        <li key={story.id}>
          <a href={story.url}>{story.title}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default EmailTemplate;
