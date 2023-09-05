import * as React from "react";

interface EmailTemplateProps {
  stories: Array<any>;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  stories,
}) => (
  <div>
    <p>New Hacker News Job Stories</p>
    <ul>
      {stories.map((story) => (
        <li key={story.id}>story.title</li>
      ))}
    </ul>
  </div>
);
