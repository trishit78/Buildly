import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";


export function useWebContainer() {
 
    const [webcontainer, setWebContainer] = useState<WebContainer | null>(null);

    async function main() {
        const webcontainerInstance = await WebContainer.boot();
        setWebContainer(webcontainerInstance);

    }

    useEffect(() => {
        main();
    },[]);

    return webcontainer;
}