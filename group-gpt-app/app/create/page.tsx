'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/submittedButton";
import { createNewAgentWithMinichar } from "@/lib/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import AvatarEditor from "react-avatar-editor";
import { useRef, useState } from "react";

export default function Page() {
  const editor = useRef<AvatarEditor>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatar,setAvatar] = useState({url:'',data:''})
  const [uploadImg, setUpload] = useState("");
  const [scale, setScale] = useState(1.2);

  function updateAvatar() {
    if (editor.current) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = editor.current.getImage();
      const canvasURL = canvas.toDataURL();
      setAvatarPreview(canvasURL);
    }
  }

  return (
    <div>
      <h1>Create Page</h1>
      <div>Start from something...</div>
      <ul>
        <li>Start from agent factory</li>
        <li>Start from Github (in developing)</li>
      </ul>

      <form action={createNewAgentWithMinichar}>
        <div className="grid grid-cols-1 gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Upload Avatar</Button>
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
                  />

                  {uploadImg && (
                    <div className="max-w-10">
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
                      <Slider
                        defaultValue={[1.2]}
                        max={3}
                        min={0.5}
                        step={0.1}
                        onValueChange={(value: number[]) => setScale(value[0])}
                      />
                    </div>
                  )}

                  {avatarPreview && (
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={avatarPreview}></AvatarImage>
                      {/* <AvatarFallback>Null</AvatarFallback> */}
                    </Avatar>
                  )}
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={()=>{setAvatarPreview('')}}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{
                    if (editor.current){
                        const imageData = editor.current.getImage().toDataURL()
                        setAvatar({data:imageData,url:avatarPreview})
                        // 这里其实有点臃肿了，因为本来这俩东西就是一样的...
                        // 我只是想不出来有什么优雅的格式，所以暂时这样写
                    }
                    
                    }}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        {avatar.data && (
            <Avatar className="w-20 h-20">
            <AvatarImage src={avatar.url}></AvatarImage>
            <AvatarFallback>Null</AvatarFallback>
        </Avatar>
        )}

        <input hidden={true} name='agentAvatar' defaultValue={avatar.data}></input>
          
{/* Avatar以外的部分 */}
          <Input
            type="text"
            name="agentShowName"
            placeholder="Agent Show Name"
          ></Input>
          <Input type="text" name="agentIntro" placeholder="Intro"></Input>
          <Select name="model">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Model</SelectLabel>
                <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input type="text" name="agentName" placeholder="agent name"></Input>
          <Input type="text" name="agentLore" placeholder="agent lore"></Input>
          <Input
            type="text"
            name="agentLanguage"
            placeholder="preferred language"
          ></Input>
          <Input
            type="text"
            name="agentTarget"
            placeholder="agent target"
          ></Input>
          <Input type="text" name="agentRule" placeholder="agent rules"></Input>
          <Input type="text" name="agentSpeech" placeholder="speech"></Input>

          <SubmitButton>Create</SubmitButton>
        </div>
      </form>
    </div>
  );
}
