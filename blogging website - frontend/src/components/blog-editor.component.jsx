import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
// import defaultBanner from "../imgs/blog banner.png"; // ❌ Banner image
import { EditorContext } from "../pages/editor.pages";
import EditorJs from "@editorjs/editorjs";
import { tools } from "./tools.component";
import Editor from "../pages/editor.pages";
import axios from "axios";
import { UserContext } from "../App";

const BlogEditor = () => {
    let {
        blog,
        blog: { title, /* banner, */ content, tags, des },
        setBlog,
        textEditor,
        setTextEditor,
        setEditorState
    } = useContext(EditorContext);

    /*
    // ❌ Removed banner upload feature
    const handleBannerUpload = (e) => {
        let img = e.target.files[0];
    };
    */
    let {userAuth : {access_token}}=useContext(UserContext);

    let navigate =useNavigate();
    useEffect(() => {
        if(!textEditor.isRedy)
        {
        setTextEditor(
            new EditorJs({
                holderId: "textEditor",
                data: content,
                tools: tools,
                placeholder: "Lets Write Something",
            })
        )}
    }, []);

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";
        setBlog({ ...blog, title: input.value });
    };

    const handlePublishEvent = () => {
        // console.log("banner:", banner, "title:", title);
        /*
        if (!banner.length) {
            return toast.error("Upload a blog banner to publish it");
        }
        */
        if (!title.length) {
         return toast.error("Write a blog title to publish it");
        }
        if(textEditor.isReady){
           textEditor.save().then((data) => {
  if(data.blocks.length) {
    setBlog({...blog,content:data});
    setEditorState("publish")
  }else{
    return toast.error("wrtie something in your blog to publish")
  }
}).catch((err) => {
  console.error("❌ Editor save failed", err);
});
        }
        
    };

    const handleSaveDraft = (e)=>{
            if(e.target.className.includes("disable"))
                {
                    return ;
                }
                if(!title.length)
                {
                    return toast.error("Write a blog title before saving it as a draft ")
                }
               
        
                let loadingToast =toast.loading("Saving Draft...");
        
                e.target.classList.add('disable');
        
                if(textEditor.isReady)
                {
                    textEditor.save().then(content=>{

                          let blogObj={
                    title,des,content,tags,draft :true
                }
                            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",blogObj,{
                    headers:{
                        'Authorization':`Bearer ${access_token}`
                    }
                })
                .then(()=>{
                    e.target.classList.add('disable');
                    toast.dismiss(loadingToast);
                    toast.success("Saved ");
        
                    setTimeout(()=>{
                        navigate("/")
                    },500)
                    
                })
                .catch(({ response})=>{
                     e.target.classList.add('disable');
                     toast.dismiss(loadingToast);
        
                     return toast.error(response.data.error);
                })
                    })
                }
              
        
                
    }

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} />
                </Link>
                <p className="max-md:hidden text-xl text-gelasio text-black line-clamp-1 w-full">
                    {title.length ? title : "New Blog"}
                </p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublishEvent}>
                        publish
                    </button>
                    <button className="btn-light py-2" onClick={handleSaveDraft}>Save draft</button>
                </div>
            </nav>

            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        {/* ❌ Banner UI removed
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label>
                                <img src={defaultBanner} className="z-20" />
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>
                        */}

                        <textarea
                            defaultValue={title}
                            placeholder="Blog title"
                            className="text-4xl font-medium w-full h-20
                outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className="w-full opacity-10 my-5" />

                        <div id="textEditor" className="font-gelasio"></div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    );
};

export default BlogEditor;
