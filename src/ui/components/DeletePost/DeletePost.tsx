"use client"

import { useRouter } from "next/navigation";
import * as postService from "@/api/service/post.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function DeletePost( {slug} : {slug: string}) {
    const router = useRouter();

    const handleDelete = async() => {
        const isConfirmed = confirm("você tem certeza que deseja excluir o post?");
        if(isConfirmed) {
            try {
                await postService.excluir(slug);
                router.refresh();
            } catch (error) {
                alert("A exclusão não foi efetuada!");
                console.error(error);
            }
        }
    };

    return (
      <div onClick={handleDelete} style={{cursor: 'pointer', color:'#000', padding: 0, margin: 0}}>
        <FontAwesomeIcon icon={faTrash} style={{width: '15px'}} />
      </div>
    )
}