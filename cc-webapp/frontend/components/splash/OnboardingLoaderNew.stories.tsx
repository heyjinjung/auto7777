import type { Meta, StoryObj } from '@storybook/react';
import OnboardingLoader from './OnboardingLoaderNew';

const meta: Meta<typeof OnboardingLoader> = {
  title: 'Components/Splash/OnboardingLoader',
  component: OnboardingLoader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Figma 디자인 기반의 Casino-Club F2P 온보딩 로딩 화면입니다. MODEL 텍스트와 네온 그라디언트 프로그레스 바가 특징입니다.',
      },
    },
  },
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '로딩 진행률 (0-100%)',
    },
    autoProgress: {
      control: 'boolean',
      description: '자동 진행 여부',
    },
    duration: {
      control: { type: 'number', min: 1000, max: 10000, step: 500 },
      description: '자동 진행 시 총 소요 시간 (ms)',
    },
    onComplete: {
      action: 'completed',
      description: '로딩 완료 시 호출되는 콜백',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OnboardingLoader>;

// 기본 스토리 - 자동 진행
export const Default: Story = {
  args: {
    autoProgress: true,
    duration: 3000,
  },
  parameters: {
    docs: {
      description: {
        story: '기본 설정으로 3초간 자동 진행되는 온보딩 로더입니다.',
      },
    },
  },
};

// 수동 진행 스토리
export const ManualProgress: Story = {
  args: {
    autoProgress: false,
    progress: 45,
  },
  parameters: {
    docs: {
      description: {
        story: '수동으로 진행률을 제어할 수 있는 온보딩 로더입니다.',
      },
    },
  },
};

// 빠른 진행 스토리
export const FastProgress: Story = {
  args: {
    autoProgress: true,
    duration: 1500,
  },
  parameters: {
    docs: {
      description: {
        story: '빠른 속도(1.5초)로 진행되는 온보딩 로더입니다.',
      },
    },
  },
};

// 느린 진행 스토리
export const SlowProgress: Story = {
  args: {
    autoProgress: true,
    duration: 5000,
  },
  parameters: {
    docs: {
      description: {
        story: '느린 속도(5초)로 진행되는 온보딩 로더입니다.',
      },
    },
  },
};

// 0% 상태
export const ZeroProgress: Story = {
  args: {
    autoProgress: false,
    progress: 0,
  },
  parameters: {
    docs: {
      description: {
        story: '로딩 시작 상태 (0%)를 보여주는 온보딩 로더입니다.',
      },
    },
  },
};

// 100% 상태
export const CompleteProgress: Story = {
  args: {
    autoProgress: false,
    progress: 100,
  },
  parameters: {
    docs: {
      description: {
        story: '로딩 완료 상태 (100%)를 보여주는 온보딩 로더입니다.',
      },
    },
  },
};

// 모바일 뷰 시뮬레이션
export const MobileView: Story = {
  args: {
    autoProgress: true,
    duration: 3000,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: '모바일 환경에서의 온보딩 로더 표시입니다.',
      },
    },
  },
};
