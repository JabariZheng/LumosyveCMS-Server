/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 00:37:45
 * @Description: utils
 */

import * as moment from 'moment';
import SnowflakeID from './snowflake';

export const getControllerName = (__dirname) => {
  return __dirname.split('/modules')[1];
};

/**
 * 时间格式化
 * @param value 时间
 * @param fmt 格式
 * @param emptyString 空值
 * @returns string
 */
export const formatDate = (
  value: any,
  fmt = 'YYYY-MM-DD HH:mm:ss',
  emptyString = '-',
) => {
  if (!value) {
    return emptyString || '';
  }
  return moment(value).format(fmt);
  // return value;
};

/**
 * 输出log
 * @param args any
 */
export const log2term = (...args: any) => {
  console.log(formatDate(+new Date()), args);
};

const options: any = {
  WorkerId: process.pid,
};
export const snowflakeID = new SnowflakeID(options);

export function arrayToNestedTree(items) {
  const result = {}; // 存储节点 id 和节点对象的映射关系
  const rootNodes = []; // 存储根节点

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const { id, parentId, name,  path, component} = item;
    const node = {
      id: item.id,
      parentId: item.parentId,
      name: item.name,
      path: item.path,
      url: item.path,
      redirect: item.redirect,
      target: '',
      meta: {
        color: '',
        hideMenu: Boolean(item.hidden),
        icon: item.icon,
        title: item.title,
      },
      // data: item.data,
      children: [],
    };

    result[item.id] = node; // 添加到节点映射关系中

    if (item.parentId === null || item.parentId === 0) {
      // 如果该节点是根节点
      rootNodes.push(node);
    } else {
      // 如果该节点不是根节点，递归查找其父节点，并将它添加到父节点的 children 数组中
      const parentNode = result[item.parentId];
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        // 如果父节点还不存在于映射关系中，递归查找其父节点的父节点，直到找到根节点，并将当前节点添加到根节点的 children 数组中
        const parentNodeChain = getParentChain(result, item.parentId);
        parentNodeChain.push(node);
      }
    }
  }

  return rootNodes; // 返回根节点数组
}

function getParentChain(result, parentId) {
  let parentNodeChain = [];
  while (parentId !== null) {
    const parentNode = result[parentId];
    parentNodeChain.unshift(parentNode);
    parentId = parentNode.parentId;
  }
  return parentNodeChain;
}
