/**
 * @File   : types.ts
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 2018-6-16 14:46:15
 * @Description:
 */
export type TEffectComponent<IControlOptions> = React.ComponentClass<IControlOptions> | ((props: IControlOptions) => JSX.Element);
export type TEffectController<IControlOptions> = React.ComponentClass<{handleChangeOptions: (options: IControlOptions) => void;}>;
export type TAsyncModule<IControlOptions> = () => Promise<{
  default: {
    info: string;
    Component: TEffectComponent<IControlOptions>;
    Controller: TEffectController<IControlOptions>;
  };
}>;

export type TEffect<IControlOptions> = {
  name: string;
  path: string;
  code?: string;
  desc: string;
  tags: string[];
  cover: string;
  date: string;
  author?: {
    name: string;
    email: string;
  },
  asyncModule: TAsyncModule<IControlOptions>;
};
