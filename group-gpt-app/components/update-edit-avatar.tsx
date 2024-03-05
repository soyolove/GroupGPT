
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { Slider } from "@/components/ui/slider";
import {Label} from  "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";


import AvatarEditor from "react-avatar-editor";
import { useRef,useState } from "react";

interface UpdateEditAvatarProps{
    children: React.ReactNode;
    setAvatar:React.Dispatch<React.SetStateAction<{data:string}>>
    
}

export function UpdateEditAvatar({children,setAvatar}:UpdateEditAvatarProps){
    const [avatarPreview, setAvatarPreview] = useState('');
    const [scale, setScale] = useState(1.2);
    const editor = useRef<AvatarEditor>(null);
    
    const [uploadImg, setUpload] = useState("");
    // 功能性state，表单用不上

    function updateAvatar() {
        if (editor.current) {
          // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
          // drawn on another canvas, or added to the DOM.
          const canvas = editor.current.getImage();
          const canvasURL = canvas.toDataURL();
          setAvatarPreview(canvasURL);
        }
      }


    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
              {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Avatar Upload</AlertDialogTitle>
                <AlertDialogDescription>
                  Please upload an image and crop it to fit the avatar.
                </AlertDialogDescription>

                <div>
                  <Input
                    id="picture"
                    type="file"
                    onChange={(event) => {
                      if (event.target.files) {
                        const file = event.target.files[0];
                        const fileUrl = URL.createObjectURL(file);
                        setUpload(fileUrl); // 更新上传图片的 URL 以供 AvatarEditor 使用
                      }
                    }}
                    className="mb-4 w-[60%] cursor-pointer"
                  />

                  {uploadImg && (
                    <div>

                      <div className="max-w-10 mb-4">
                        <AvatarEditor
                          ref={editor}
                          image={uploadImg}
                          width={250}
                          height={250}
                          border={50}
                          scale={scale}
                          onImageReady={updateAvatar}
                          onMouseMove={updateAvatar}
                        />
                      </div>
                   

                      
                      <div className="flex flex-row">
                      <Label className='mt-4 mb-4'>Scale</Label>
                      <Slider
                        className='w-[60%]  ml-3 mt-4 mb-4'
                          defaultValue={[1.2]}
                          max={3}
                          min={0.5}
                          step={0.1}
                          onValueChange={(value: number[]) => setScale(value[0])}
                      />
                      </div>
                    </div>
                  )}

                  {avatarPreview && (
                    <>
                    <Label className='mt-4 mb-4'>Avatar Preview</Label>
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={avatarPreview}></AvatarImage>
                      {/* <AvatarFallback>Null</AvatarFallback> */}
                    </Avatar>
                    </>
                  )}
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={()=>{setAvatarPreview('')}}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={():void=>{
                    if (editor.current){
                        setAvatar({data:avatarPreview})

                    }
                    
                    }}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    )
}