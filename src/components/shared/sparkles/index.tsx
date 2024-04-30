import { range, random } from 'lodash-es';
import styled, { keyframes } from 'styled-components';

import React from 'react';
import { useRandomInterval, usePrefersReducedMotion } from '@/hooks';

// 默认颜色
const DEFAULT_COLOR = '#FFC700';
/**
 * @description 生成一个闪光效果对象。
 * @param {string} color - 闪光效果的颜色。
 * @returns {object} 包含闪光效果属性的对象。
 */
function generateSparkle(color: string) {
  const sparkle = {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color,
    size: random(10, 20),
    style: {
      top: `${random(0, 100)}%`,
      left: `${random(0, 100)}%`,
    },
  };
  return sparkle;
}

const comeInOut = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
`;

const SparkleSvg = styled.svg`
  display: block;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${spin} 1000ms linear;
  }
`;
const SparkleWrapper = styled.span`
  position: absolute;
  display: block;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${comeInOut} 700ms forwards;
  }
`;

function Sparkle({
  size,
  color,
  style,
}: {
  size: number;
  color: string;
  style: React.CSSProperties;
}) {
  const path
    = 'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z';

  return (
    <SparkleWrapper style={style}>
      <SparkleSvg width={size} height={size} viewBox="0 0 68 68" fill="none">
        <path d={path} fill={color} />
      </SparkleSvg>
    </SparkleWrapper>
  );
}

interface Props {
  color?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
function Sparkles({ color = DEFAULT_COLOR, children, ...props }: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [sparkles, setSparkles] = React.useState(() => {
    return range(3).map(() => generateSparkle(color));
  });

  useRandomInterval(
    () => {
      // 从现有的闪光效果中过滤出仍然可见的闪光效果
      const sparkle = generateSparkle(color); // 生成一个新的闪光效果
      const now = Date.now(); // 获取当前时间
      const nextSparkles = sparkles.filter((sp) => {
        // 计算闪光效果的显示时间，如果在750毫秒内创建的闪光效果仍然可见，则保留
        const delta = now - sp.createdAt;
        return delta < 750;
      });
      nextSparkles.push(sparkle);
      setSparkles(nextSparkles);
    },
    prefersReducedMotion ? null : 50,
    prefersReducedMotion ? null : 450,
  );

  const wrapperClass = `relative inline-block ${props.className}`;
  return (
    <span className={wrapperClass} style={props.style} {...props}>
      {sparkles.map(sparkle => (
        <Sparkle key={sparkle.id} color={sparkle.color} size={sparkle.size} style={sparkle.style} />
      ))}
      <strong className="relative z-1 font-bold">
        {' '}
        {children}
        {' '}
      </strong>
    </span>
  );
}

export default Sparkles;
