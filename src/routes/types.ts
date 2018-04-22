/**
 * @File   : types.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-8 15:01:42
 * @Link: dtysky.moe
 */
export type TRouteSource = {
  name: string,
  desc: string,
  tags: string[],
  cover: string,
  info: string,
  date: string,
  author?: {
    name: string,
    email: string
  },
  Component: React.ComponentClass<any> | React.StatelessComponent<any>,
  Controller: React.ComponentClass<any> | React.StatelessComponent<any> | null
};

export type TRouteItem = {
  name: string,
  path: string,
  desc: string,
  tags: string[],
  cover: string,
  info: string,
  date: Date,
  author: {
    name: string,
    email: string
  },
  Component: React.ComponentClass<any> | React.StatelessComponent<any>,
  Controller: React.ComponentClass<any> | React.StatelessComponent<any> | null
};
