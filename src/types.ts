/**
 * @File   : types.ts
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 2018-6-16 14:46:15
 * @Description:
 */
export type TEffect<IControlOptions> = {
  name: string,
  path: string,
  code?: string;
  desc: string,
  tags: string[],
  cover: string,
  info: string,
  date: string,
  author?: {
    name: string,
    email: string
  },
  Component: React.ComponentClass<IControlOptions> | ((props: IControlOptions) => JSX.Element);
  Controller: React.ComponentClass<{handleChangeOptions: (options: IControlOptions) => void}>;
};
