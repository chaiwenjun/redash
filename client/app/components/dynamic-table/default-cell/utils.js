import { isUndefined, isFunction } from 'underscore';

const hasOwnProperty = Object.prototype.hasOwnProperty;

function trim(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

function processTags(str, data, defaultColumn) {
  return str.replace(/{{\s*([^\s]+)\s*}}/g, (match, column) => {
    if (column === '@') {
      column = defaultColumn;
    }
    if (hasOwnProperty.call(data, column) && !isUndefined(data[column])) {
      return data[column];
    }
    return match;
  });
}

export function renderDefault(column, row) {
  const value = row[column.name];
  if (isFunction(column.formatFunction)) {
    return column.formatFunction(value);
  }
  return value;
}

export function renderImage(column, row) {
  const url = trim(processTags(column.imageUrlTemplate, row, column.name));
  const width = parseInt(processTags(column.imageWidth, row, column.name), 10);
  const height = parseInt(processTags(column.imageHeight, row, column.name), 10);
  const title = trim(processTags(column.imageTitleTemplate, row, column.name));

  const result = [];
  if (url !== '') {
    result.push('<img src="' + url + '"');

    if (isFinite(width) && (width > 0)) {
      result.push('width="' + width + '"');
    }
    if (isFinite(height) && (height > 0)) {
      result.push('height="' + height + '"');
    }
    if (title !== '') {
      result.push('title="' + title + '"');
    }

    result.push('>');
  }

  return result.join(' ');
}

export function renderLink(column, row) {
  const url = trim(processTags(column.linkUrlTemplate, row, column.name));
  const title = trim(processTags(column.linkTitleTemplate, row, column.name));
  const text = trim(processTags(column.linkTextTemplate, row, column.name));

  const result = [];
  if (url !== '') {
    result.push('<a href="' + url + '"');
    //chai add url在iframe内跳转
    result.push('onclick="openNewPage(event,this)"');
    if (title !== '') {
      result.push('title="' + title + '"');
    }
    if (column.linkOpenInNewTab) {
      result.push('target="_blank"');
    }
    result.push('>' + (text === '' ? url : text) + '</a>');
  }

  return result.join(' ');
}
export  function openNewPage(ev,obj) {
        ev.preventDefault();
        var newPageUrl=encodeURIComponent(obj.getAttribute('href'));
        window.parent.postMessage(newPageUrl, '*');
}
