import React from 'react';

/**
 * 진로 문장의 가독성을 위한 자동 줄바꿈 함수
 * 
 * @param text - 원본 진로 문장
 * @returns HTML 형태의 줄바꿈이 적용된 문장
 */
export function formatCareerSentence(text: string): string {
  // 40자 미만이면 그대로 반환
  if (text.length < 40) {
    return text;
  }

  // 줄바꿈 후보 위치들을 찾기 위한 패턴들 (우선순위 순)
  const breakPatterns = [
    /(.+?)(으로|를 통해|에서|에게|에|로|와|과|및)\s/g,
    /(.+?)(하는|되는|인|의|을|를)\s/g,
    /(.+?)(,|\.|\s)\s/g
  ];

  const textLength = text.length;
  const idealBreakPoint = Math.floor(textLength / 2);
  let bestBreakPoint = -1;
  let minDifference = Infinity;

  // 각 패턴에 대해 최적의 줄바꿈 위치 찾기
  for (const pattern of breakPatterns) {
    const matches = Array.from(text.matchAll(pattern));
    
    for (const match of matches) {
      const breakPoint = match.index! + match[1].length;
      const difference = Math.abs(breakPoint - idealBreakPoint);
      
      // 첫 줄과 둘째 줄의 길이 차이가 5자 이내인지 확인
      const firstLineLength = breakPoint;
      const secondLineLength = textLength - breakPoint;
      const lengthDifference = Math.abs(firstLineLength - secondLineLength);
      
      if (lengthDifference <= 5 && difference < minDifference) {
        minDifference = difference;
        bestBreakPoint = breakPoint;
      }
    }
    
    // 좋은 위치를 찾았으면 더 이상 탐색하지 않음
    if (bestBreakPoint !== -1) break;
  }

  // 적절한 줄바꿈 위치를 찾지 못했으면 중간 지점에서 단어 경계로 나누기
  if (bestBreakPoint === -1) {
    const words = text.split(' ');
    let currentLength = 0;
    let wordIndex = 0;
    
    for (let i = 0; i < words.length; i++) {
      const nextLength = currentLength + words[i].length + (i > 0 ? 1 : 0);
      if (nextLength >= idealBreakPoint) {
        wordIndex = i;
        break;
      }
      currentLength = nextLength;
    }
    
    const firstPart = words.slice(0, wordIndex).join(' ');
    const secondPart = words.slice(wordIndex).join(' ');
    
    return firstPart + '<br />' + secondPart;
  }

  // 최적의 위치에서 줄바꿈
  const firstLine = text.substring(0, bestBreakPoint).trim();
  const secondLine = text.substring(bestBreakPoint).trim();
  
  return firstLine + '<br />' + secondLine;
}

/**
 * HTML 형태의 줄바꿈을 React JSX로 변환
 */
export function parseFormattedText(formattedText: string): React.ReactNode {
  if (!formattedText.includes('<br />')) {
    return formattedText;
  }

  const parts = formattedText.split('<br />');
  return React.createElement(
    React.Fragment,
    null,
    parts.map((part, index) => 
      React.createElement(
        React.Fragment,
        { key: index },
        part,
        index < parts.length - 1 ? React.createElement('br') : null
      )
    )
  );
}