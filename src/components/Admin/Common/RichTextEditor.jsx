import WysiwygEditor, {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnUnderline,
  BtnUndo,
  Toolbar,
} from 'react-simple-wysiwyg';

const Editor = WysiwygEditor.default ?? WysiwygEditor;

const RichTextEditor = ({ id, name, value = '', onChange, placeholder = 'Nhập nội dung...', disabled = false }) => (
  <Editor
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    containerProps={{ className: 'admin-wysiwyg' }}
  >
    <Toolbar>
      <BtnUndo title="Hoàn tác" />
      <BtnRedo title="Làm lại" />
      <BtnBold title="In đậm" />
      <BtnItalic title="In nghiêng" />
      <BtnUnderline title="Gạch chân" />
      <BtnBulletList title="Danh sách" />
      <BtnNumberedList title="Danh sách đánh số" />
      <BtnLink title="Chèn liên kết" />
      <BtnClearFormatting title="Xóa định dạng" />
    </Toolbar>
  </Editor>
);

export default RichTextEditor;
