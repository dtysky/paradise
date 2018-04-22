/**
 * @File   : MarkdownElement.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-8 15:09:22
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as marked from 'marked';
import * as cx from 'classnames';

import './markdown.scss';

interface IPropTypes {
  markdown: string;
}

export default class Markdown extends React.Component<IPropTypes, {}> {
  public componentWillMount() {
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });
  }

  public render() {
    const {
      markdown
    } = this.props;

    return (
      <div className={cx('markdown')}>
        <div dangerouslySetInnerHTML={{__html: marked(markdown)}} />
      </div>
    );
  }
}
