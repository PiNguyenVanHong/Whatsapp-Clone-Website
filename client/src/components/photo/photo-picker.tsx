import ReactDOM from "react-dom";

interface PhotoPickerProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

function PhotoPicker({  onChange }: PhotoPickerProps) {
    const component = (
        <input id="photo-picker" onChange={onChange} type="file" name="file" hidden />
    );

    return ReactDOM.createPortal(
            component,
            document.getElementById("photo-picker-element")!
        );
};

export default PhotoPicker;