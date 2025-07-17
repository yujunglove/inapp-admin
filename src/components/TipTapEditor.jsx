import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import Underline from '@tiptap/extension-underline';
import EmojiPicker from 'emoji-picker-react';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Type,
    Highlighter,
    Smile
} from 'lucide-react';

const TipTapEditor = ({
                          titleValue = '',
                          bodyValue = '',
                          onTitleChange = () => {},
                          onBodyChange = () => {},
                          showTitle = true,
                          showBody = true
                      }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeEditor, setActiveEditor] = useState('title');
    const [toast, setToast] = useState({ show: false, message: '' });
    const [showTextColorPicker, setShowTextColorPicker] = useState(false);
    const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
    const [colorPickerPosition, setColorPickerPosition] = useState({ top: 0, left: 0 });

    // 색상 팔레트
    const colors = [
        '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
        '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
        '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
        '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
        '#EC4899', '#F43F5E'
    ];

    const highlightColors = [
        '#FEF3C7', '#FED7AA', '#FECACA', '#F3E8FF', '#E0E7FF',
        '#DBEAFE', '#BFDBFE', '#BAE6FD', '#A7F3D0', '#BBF7D0',
        '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706'
    ];

    // 색상 피커 위치 계산
    const handleColorPickerPosition = (e, type) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setColorPickerPosition({
            top: rect.bottom + 8,
            left: rect.left + (rect.width / 2) - 75
        });

        if (type === 'text') {
            setShowTextColorPicker(!showTextColorPicker);
            setShowHighlightColorPicker(false);
        } else {
            setShowHighlightColorPicker(!showHighlightColorPicker);
            setShowTextColorPicker(false);
        }
    };

    // 토스트 표시 함수
    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    // 텍스트 길이 계산 함수
    const getTextLength = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return (div.textContent || div.innerText || '').length;
    };

    const titleTextLength = getTextLength(titleValue);
    const bodyTextLength = getTextLength(bodyValue);

    // 제목 에디터
    const titleEditor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Color,
            TextStyle,
            Highlight.configure({
                multicolor: true,
            }),
            FontFamily.configure({
                types: ['textStyle'],
            }),
            Underline,
        ],
        content: titleValue,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const textLength = getTextLength(html);
            if (textLength > 25) {
                showToast('제목은 25자 이내로 입력해주세요.');
                editor.commands.setContent(titleValue);
                return;
            }
            onTitleChange(html); // 외부로 전달
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none title-editor-content',
            },
            handleKeyDown: (view, event) => {
                if (event.key === 'Backspace' || event.key === 'Delete') {
                    return false;
                }
                const currentLength = getTextLength(view.state.doc.textContent);
                if (currentLength >= 25 && view.state.selection.empty) {
                    showToast('제목은 25자 이내로 입력해주세요.');
                    return true;
                }
                return false;
            },
        },
    });

    // 내용 에디터
    const bodyEditor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Color,
            TextStyle,
            Highlight.configure({
                multicolor: true,
            }),
            FontFamily.configure({
                types: ['textStyle'],
            }),
            Underline,
        ],
        content: bodyValue,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const textLength = getTextLength(html);
            if (textLength > 50) {
                showToast('내용은 50자 이내로 입력해주세요.');
                editor.commands.setContent(bodyValue);
                return;
            }
            onBodyChange(html); // 외부로 전달
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none body-editor-content',
            },
            handleKeyDown: (view, event) => {
                if (event.key === 'Backspace' || event.key === 'Delete') {
                    return false;
                }
                const currentLength = getTextLength(view.state.doc.textContent);
                if (currentLength >= 50 && view.state.selection.empty) {
                    showToast('내용은 50자 이내로 입력해주세요.');
                    return true;
                }
                return false;
            },
        },
    });

    // 외부 값 변경 시 에디터 업데이트
    useEffect(() => {
        if (titleEditor && titleEditor.getHTML() !== titleValue) {
            titleEditor.commands.setContent(titleValue);
        }
    }, [titleValue, titleEditor]);

    useEffect(() => {
        if (bodyEditor && bodyEditor.getHTML() !== bodyValue) {
            bodyEditor.commands.setContent(bodyValue);
        }
    }, [bodyValue, bodyEditor]);

    // 이모지 클릭 핸들러
    const onEmojiClick = (emojiObject) => {
        const editor = activeEditor === 'title' ? titleEditor : bodyEditor;
        if (editor) {
            editor.chain().focus().insertContent(emojiObject.emoji).run();
            setShowEmojiPicker(false);
        }
    };

    // 툴바 컴포넌트
    const Toolbar = ({ editor, isTitle = false }) => {
        if (!editor) return null;

        return (
            <div className="toolbar">
                {/* 폰트 패밀리 */}
                <select
                    onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                    onChange={(e) => {
                        if (e.target.value === '') {
                            editor.chain().focus().unsetFontFamily().run();
                        } else {
                            editor.chain().focus().setFontFamily(e.target.value).run();
                        }
                    }}
                    className="toolbar-select font-select"
                >
                    <option value="">기본 폰트</option>
                    <option value="'Nanum Gothic', sans-serif">나눔고딕</option>
                    <option value="'Nanum Myeongjo', serif">나눔명조</option>
                    <option value="'Nanum Pen Script', cursive">나눔펜글씨</option>
                    <option value="'Nanum Brush Script', cursive">나눔붓글씨</option>
                </select>

                {/* 폰트 크기 */}
                <select
                    onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                    onChange={(e) => {
                        const fontSize = e.target.value;
                        if (fontSize === '') {
                            // 기본 크기로 리셋
                            editor.chain().focus().unsetMark('textStyle').run();
                        } else {
                            editor.chain().focus().setMark('textStyle', { fontSize: fontSize + 'px' }).run();
                        }
                    }}
                    className="toolbar-select size-select"
                    defaultValue="10"
                >
                    <option value="">크기</option>
                    <option value="8">8px</option>
                    <option value="9">9px</option>
                    <option value="10">10px</option>
                    <option value="11">11px</option>
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                    <option value="24">24px</option>
                    <option value="28">28px</option>
                    <option value="32">32px</option>
                    <option value="36">36px</option>
                    <option value="48">48px</option>
                </select>

                <div className="toolbar-divider"></div>

                {/* 텍스트 스타일 */}
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBold().run();
                    }}
                    className={`toolbar-button ${editor.isActive('bold') ? 'active' : ''}`}
                    type="button"
                >
                    <Bold size={14} />
                </button>
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleItalic().run();
                    }}
                    className={`toolbar-button ${editor.isActive('italic') ? 'active' : ''}`}
                    type="button"
                >
                    <Italic size={14} />
                </button>
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleUnderline().run();
                    }}
                    className={`toolbar-button ${editor.isActive('underline') ? 'active' : ''}`}
                    type="button"
                >
                    <UnderlineIcon size={14} />
                </button>

                <div className="toolbar-divider"></div>

                {/* 텍스트 색상 */}
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleColorPickerPosition(e, 'text');
                    }}
                    className="toolbar-button color-button"
                    title="텍스트 색상"
                    type="button"
                >
                    <Type size={14} />
                </button>

                {/* 배경 색상 */}
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleColorPickerPosition(e, 'highlight');
                    }}
                    className="toolbar-button color-button"
                    title="배경 색상"
                    type="button"
                >
                    <Highlighter size={14} />
                </button>

                <div className="toolbar-divider"></div>

                {/* 정렬 */}
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        editor.chain().focus().setTextAlign('left').run();
                    }}
                    className={`toolbar-button ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
                    type="button"
                >
                    <AlignLeft size={14} />
                </button>
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        editor.chain().focus().setTextAlign('center').run();
                    }}
                    className={`toolbar-button ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
                    type="button"
                >
                    <AlignCenter size={14} />
                </button>
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        editor.chain().focus().setTextAlign('right').run();
                    }}
                    className={`toolbar-button ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
                    type="button"
                >
                    <AlignRight size={14} />
                </button>

                <div className="toolbar-divider"></div>

                {/* 이모지 버튼 */}
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setActiveEditor(isTitle ? 'title' : 'body');
                        setShowEmojiPicker(!showEmojiPicker);
                    }}
                    className="toolbar-button"
                    title="이모지 추가"
                    type="button"
                >
                    <Smile size={14} />
                </button>
            </div>
        );
    };

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&family=Nanum+Myeongjo:wght@400;700;800&family=Nanum+Pen+Script&family=Nanum+Brush+Script&display=swap');
        
        .editor-container {
            border: 1px solid rgb(209, 213, 219);
            border-radius: 10px;
            background: white;
            transition: all 0.2s ease;
            position: relative;
        }
        
        .title-editor {
            min-height: 80px;
        }
        
        .body-editor {
            min-height: 200px;
        }
        
        .toolbar {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-bottom: 1px solid #e2e8f0;
            border-radius: 10px 10px 0 0;
            flex-wrap: nowrap;
            overflow-x: auto;
            position: relative;
        }
        
        .toolbar-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border: none;
            border-radius: 6px;
            background: transparent;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
        }
        
        .toolbar-button:hover {
            background: #e2e8f0;
            color: #475569;
            transform: translateY(-1px);
        }
        
        .toolbar-button.active {
            background: #3b82f6;
            color: white;
        }
        
        .toolbar .toolbar-select {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            background: white;
            font-size: 12px;
            color: #374151;
            cursor: pointer;
            min-width: 85px !important;
            flex-shrink: 0;
        }
        
  div.toolbar select.toolbar-select.font-select {
    width: 95px !important;
    flex-basis: 75px !important;
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
    box-sizing: border-box !important;
}

div.toolbar select.toolbar-select.size-select {
    width: 70px !important;
    flex-basis: 50px !important;
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
    box-sizing: border-box !important;
}
        
        .toolbar .toolbar-select:focus {
            outline: none;
            border-color: #3b82f6;
        }
        
        .color-palette-portal {
            position: fixed;
            z-index: 9999;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 8px;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 4px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            min-width: 150px;
        }
        
        .color-palette-portal::before {
            content: '';
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid white;
        }
        
        .color-swatch {
            width: 20px;
            height: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            cursor: pointer;
            transition: transform 0.1s ease;
        }
        
        .color-swatch:hover {
            transform: scale(1.1);
            border-color: #3b82f6;
        }
        
        .toolbar-divider {
            width: 1px;
            height: 24px;
            background: #d1d5db;
            margin: 0 4px;
            flex-shrink: 0;
        }
        
        .title-editor-content {
            padding: 10px 10px !important;
            min-height: 40px !important;
            font-size: 16px !important;
            border-radius: 0 0 10px 10px;
        }
        
        .body-editor-content {
            padding: 20px !important;
            min-height: 140px !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
            font-family: 'Nanum Gothic', sans-serif;
            border-radius: 0 0 10px 10px;
        }
        
        .ProseMirror {
            outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
            color: #9ca3af;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
        }
        
        .emoji-picker-container {
            position: absolute;
            top: 100%;
            right: 0;
            z-index: 1000;
            margin-top: 8px;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 2000;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from { 
                transform: translateX(100%) translateY(-50%); 
                opacity: 0;
            }
            to { 
                transform: translateX(0) translateY(0); 
                opacity: 1;
            }
        }
        
        .toolbar::-webkit-scrollbar {
            height: 4px;
        }
        
        .toolbar::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        
        .toolbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 2px;
        }
        
        .toolbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    `;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <style>{styles}</style>

            {/* 제목 에디터 */}
            {showTitle && (
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                    }}>
                        <label style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#1f2937',
                            letterSpacing: '-0.025em'
                        }}>
                            제목
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                                fontSize: '11px',
                                color: '#6b7280',
                                padding: '4px 8px',
                            }}>
                                테스트 문구로 인하여 실제 발송 내용과 상이할 수 있습니다.
                            </span>
                            <span style={{
                                fontSize: '9px',
                                color: titleTextLength > 25 ? '#ef4444' : '#6b7280',
                                fontWeight: '600',
                                background: titleTextLength > 25 ? '#fef2f2' : '#f9fafb',
                                padding: '4px 4px',
                                borderRadius: '6px',
                                border: `1px solid ${titleTextLength > 25 ? '#fecaca' : '#e5e7eb'}`
                            }}>
                                {titleTextLength}/25
                            </span>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div className="editor-container title-editor">
                            <Toolbar editor={titleEditor} isTitle={true} />
                            <EditorContent
                                editor={titleEditor}
                                placeholder="제목을 입력하세요"
                            />
                        </div>

                        {/* 이모지 피커 */}
                        {showEmojiPicker && activeEditor === 'title' && (
                            <div className="emoji-picker-container">
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    width={350}
                                    height={400}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 내용 에디터 */}
            {showBody && (
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                    }}>
                        <label style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#1f2937',
                            letterSpacing: '-0.025em'
                        }}>
                            내용
                        </label>
                        <span style={{
                            fontSize: '9px',
                            color: bodyTextLength > 50 ? '#ef4444' : '#6b7280',
                            fontWeight: '600',
                            background: bodyTextLength > 50 ? '#fef2f2' : '#f9fafb',
                            padding: '4px 4px',
                            borderRadius: '6px',
                            border: `1px solid ${bodyTextLength > 50 ? '#fecaca' : '#e5e7eb'}`
                        }}>
                            {bodyTextLength}/50
                        </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div className="editor-container body-editor">
                            <Toolbar editor={bodyEditor} isTitle={false} />
                            <EditorContent
                                editor={bodyEditor}
                                placeholder="내용을 입력하세요"
                            />
                        </div>

                        {/* 이모지 피커 */}
                        {showEmojiPicker && activeEditor === 'body' && (
                            <div className="emoji-picker-container">
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    width={350}
                                    height={400}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 색상 팔레트 포털 */}
            {showTextColorPicker && (
                <div
                    className="color-palette-portal"
                    style={{
                        top: `${colorPickerPosition.top}px`,
                        left: `${colorPickerPosition.left}px`
                    }}
                >
                    {colors.map(color => (
                        <button
                            key={color}
                            className="color-swatch"
                            style={{ backgroundColor: color }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const editor = activeEditor === 'title' ? titleEditor : bodyEditor;
                                if (editor) {
                                    const { from, to } = editor.state.selection;
                                    if (from !== to) {
                                        editor.chain().setColor(color).run();
                                    } else {
                                        editor.chain().focus().setColor(color).run();
                                    }
                                }
                                setShowTextColorPicker(false);
                            }}
                            title={color}
                        />
                    ))}
                </div>
            )}

            {showHighlightColorPicker && (
                <div
                    className="color-palette-portal"
                    style={{
                        top: `${colorPickerPosition.top}px`,
                        left: `${colorPickerPosition.left}px`
                    }}
                >
                    {highlightColors.map(color => (
                        <button
                            key={color}
                            className="color-swatch"
                            style={{ backgroundColor: color }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const editor = activeEditor === 'title' ? titleEditor : bodyEditor;
                                if (editor) {
                                    const { from, to } = editor.state.selection;
                                    if (from !== to) {
                                        editor.chain()
                                            .unsetHighlight()
                                            .setHighlight({ color: color })
                                            .run();
                                    } else {
                                        editor.chain()
                                            .focus()
                                            .unsetHighlight()
                                            .setHighlight({ color: color })
                                            .run();
                                    }
                                }
                                setShowHighlightColorPicker(false);
                            }}
                            title={color}
                        />
                    ))}
                </div>
            )}

            {/* 토스트 메시지 */}
            {toast.show && (
                <div className="toast">
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default TipTapEditor;