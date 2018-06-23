/**
 * @File   : Tools.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-6-16 17:01:43
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import * as eruda from 'eruda';
import * as erudaTiming from 'eruda-timing';
import * as Stats from 'stats.js';

export interface IPropTypes {}

export interface IStateTypes {
  openSetting: boolean;
  openTools: boolean;
}

export default class Tools extends React.Component<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    openSetting: false,
    openTools: false
  };

  private statsContainer: React.RefObject<HTMLDivElement> = React.createRef();
  private consoleContainer: React.RefObject<HTMLDivElement> = React.createRef();
  private rafID = 0;
  private stats: Stats;

  public componentDidMount() {
    this.initTools();
    this.loop();
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.rafID);
    eruda.destroy();
  }

  private initTools() {
    if (window.performance) {
      const stats = this.stats = new Stats();
      stats.showPanel(0);
      stats.showPanel(1);
      stats.showPanel(2);
      stats.dom.className = 'pd-tools-stats-content';
      stats.dom.style.position = 'relative';
      this.statsContainer.current.appendChild(stats.dom);

      const children = stats.dom.children;
      for (let i = 0; i < children.length; i += 1) {
        children[i].style.display = 'inline-block';
        children[i].style.width = '32%';
        children[i].style.marginRight = '1%';
        children[i].style.height = '84px';
      }
    }

    eruda.init({
      container: this.consoleContainer.current,
      tool: ['console', 'timing', 'info']
    });
    eruda.add(erudaTiming);

    eruda.show();

    const devTools = document.getElementsByClassName('eruda-dev-tools')[0] as HTMLDivElement;
    devTools.style.height = '';
  }

  private loop = () => {
    if (this.stats) {
      this.stats.update();
      this.rafID = requestAnimationFrame(this.loop);
    }
  }

  public render() {
    return (
      <div className={'pd-demo-tools'}>
        <div
          className={cx('pd-tools-stats')}
          ref={this.statsContainer}
        />
        <div
          className={cx('pd-tools-eruda')}
          ref={this.consoleContainer}
        />
      </div>
    );
  }
}
