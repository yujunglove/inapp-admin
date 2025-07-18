import React from 'react';

// 공통 스타일 상수와 함수들
export const colors = {
  primary: '#169DAF',
  primaryDark: '#127a8a',
  primaryLight: '#3fd2f2',
  primaryBg: 'rgba(22, 157, 175, 0.1)',
  primaryBorder: 'rgba(22, 157, 175, 0.2)',
  primaryShadow: 'rgba(22, 157, 175, 0.18)',
  
  success: '#10b981',
  successDark: '#059669',
  
  error: '#dc2626',
  errorBg: '#fef2f2',
  
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },
  
  text: {
    primary: '#1f2937',
    secondary: '#4a4e56',
    disabled: '#b0b8c2',
    placeholder: '#adbcc6'
  }
};

export const gradients = {
  headerActive: 'linear-gradient(30deg, #e4f5fa 0%, #c0e6ef 60%, #fafdff 100%)',
  headerInactive: '#f3f6f8',
  primary: 'linear-gradient(120deg, #169DAF 65%, #3fd2f2 100%)',
  button: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
  buttonHover: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)'
};

export const commonStyles = {
  // 카드 스타일
  card: {
    base: {
      borderRadius: '18px',
      marginBottom: '32px',
      background: 'white',
      transition: 'box-shadow .18s cubic-bezier(.4,0,.2,1)'
    },
    active: {
      border: `1px solid ${colors.primaryBorder}`,
      boxShadow: `0 1px 4px 0 ${colors.primaryShadow}`
    },
    inactive: {
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 4px 0 rgba(181, 181, 181, 0.14)'
    }
  },

  // 헤더 스타일
  cardHeader: {
    base: {
      padding: '20px 28px 14px 28px',
      borderRadius: '18px 18px 0px 0px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    active: {
      background: gradients.headerActive,
      borderBottom: '1.5px solid #169DAF33'
    },
    inactive: {
      background: gradients.headerInactive,
      borderBottom: '1px solid #e5e7eb'
    }
  },

  // 헤더 타이틀
  cardTitle: {
    active: {
      margin: 0,
      fontSize: '14px',
      fontWeight: 700,
      color: '#0e636e',
      letterSpacing: '-0.5px',
      transition: 'color .18s'
    },
    inactive: {
      margin: 0,
      fontSize: '14px',
      fontWeight: 700,
      color: '#8ba7b3',
      letterSpacing: '-0.5px',
      transition: 'color .18s'
    }
  },

  // 헤더 설명
  cardDescription: {
    active: {
      margin: '7px 0 0 0',
      fontSize: '12px',
      color: '#4a4e56',
      fontWeight: 400,
      opacity: 0.92,
      transition: 'color .18s, opacity .18s'
    },
    inactive: {
      margin: '7px 0 0 0',
      fontSize: '12px',
      color: '#b0b8c2',
      fontWeight: 400,
      opacity: 0.72,
      transition: 'color .18s, opacity .18s'
    }
  },

  // 카드 콘텐츠
  cardContent: {
    active: {
      padding: '22px 18px 18px 18px',
      background: '#fff',
      borderRadius: '0 0 18px 18px'
    },
    inactive: {
      padding: '36px 28px 36px 28px',
      background: '#f9fafb',
      borderRadius: '0 0 18px 18px',
      textAlign: 'center',
      color: '#adbcc6',
      fontSize: '12px',
      fontWeight: 400,
      letterSpacing: '-0.2px'
    }
  },

  // 입력 필드
  input: {
    base: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease'
    },
    normal: {
      border: `1px solid ${colors.gray[300]}`,
      background: 'white'
    },
    error: {
      border: `1px solid ${colors.error}`,
      background: colors.errorBg
    },
    withIcon: {
      paddingRight: '40px'
    }
  },

  // 버튼
  button: {
    base: {
      padding: '4px 8px',
      background: colors.gray[50],
      color: colors.gray[500],
      border: `1px solid ${colors.gray[200]}`,
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      transform: 'translateY(0)'
    },
    hover: {
      background: colors.gray[200],
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    addButton: {
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      border: `1px solid ${colors.gray[200]}`,
      background: '#f5f9fc',
      color: colors.primary,
      fontSize: '22px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    removeButton: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: colors.gray[200],
      color: colors.error,
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },

  // 라벨
  label: {
    base: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '12px',
      fontWeight: '500'
    }
  },

  // 스크롤 영역
  scrollArea: {
    base: {
      maxHeight: '500px',
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
    },
    webkit: `
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(156, 163, 175, 0.5);
        border-radius: 3px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: rgba(156, 163, 175, 0.8);
      }
    `
  },

  // 아이템 박스
  itemBox: {
    base: {
      border: `1px solid ${colors.gray[200]}`,
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '16px',
      background: colors.gray[50],
      position: 'relative'
    }
  },

  // 체크 아이콘
  checkIcon: {
    container: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: colors.success,
      fontSize: '16px'
    }
  },

  // 토스트
  toast: {
    base: {
      position: 'fixed',
      background: '#333',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '500',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      maxWidth: '200px',
      wordWrap: 'break-word',
      pointerEvents: 'none',
      whiteSpace: 'nowrap'
    },
    arrow: {
      position: 'absolute',
      bottom: '-6px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 0,
      height: 0,
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: '6px solid #333'
    }
  }
};

// 스타일 생성 헬퍼 함수
export const getCardStyle = (enabled) => ({
  ...commonStyles.card.base,
  ...(enabled ? commonStyles.card.active : commonStyles.card.inactive)
});

export const getCardHeaderStyle = (enabled) => ({
  ...commonStyles.cardHeader.base,
  ...(enabled ? commonStyles.cardHeader.active : commonStyles.cardHeader.inactive)
});

export const getCardTitleStyle = (enabled) => 
  enabled ? commonStyles.cardTitle.active : commonStyles.cardTitle.inactive;

export const getCardDescriptionStyle = (enabled) => 
  enabled ? commonStyles.cardDescription.active : commonStyles.cardDescription.inactive;

export const getCardContentStyle = (enabled) => 
  enabled ? commonStyles.cardContent.active : commonStyles.cardContent.inactive;

export const getInputStyle = (hasError, hasIcon = false) => ({
  ...commonStyles.input.base,
  ...(hasError ? commonStyles.input.error : commonStyles.input.normal),
  ...(hasIcon ? { paddingRight: commonStyles.input.withIcon.paddingRight } : {})
});

// 공통 컴포넌트
export const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const ValidationButton = ({ onClick, onMouseEnter, onMouseLeave }) => (
  <button
    type="button"
    onClick={onClick}
    style={commonStyles.button.base}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    링크 검증
  </button>
);
