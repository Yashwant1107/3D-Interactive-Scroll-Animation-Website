import React, { useEffect, useRef } from 'react'
import * as THREE from "three"
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture, useAnimations } from '@react-three/drei'
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Dog = () => {

    gsap.registerPlugin(useGSAP())
    gsap.registerPlugin(ScrollTrigger)

    const model = useGLTF("/models/dog.drc.glb")

    useThree(({ camera, scene, gl }) => {
        camera.position.z = 0.41
        gl.toneMapping = THREE.ReinhardToneMapping
        gl.outputColorSpace = THREE.SRGBColorSpace
    })

    const { actions } = useAnimations(model.animations, model.scene)

    useEffect(() => {
        actions["Take 001"].play()
    }, [actions])



    const [normalMap, sampleMatCap] = useTexture([
        "/models/dog_normals.jpg",
        "/models/matcap/mat-2.png"
    ])

    const [branchMap, branchNormalMap] = useTexture([
        "/models/branches_diffuse.jpg",
        "/models/branches_normals.jpg"
    ])

    branchMap.colorSpace = THREE.SRGBColorSpace
    sampleMatCap.colorSpace = THREE.SRGBColorSpace

    normalMap.flipY = false
    branchNormalMap.flipY = false
    branchMap.flipY = false
    sampleMatCap.flipY = false

    const dogMaterial = new THREE.MeshMatcapMaterial({
        matcap: sampleMatCap,
        normalMap: normalMap
    })

    const branchMaterial = new THREE.MeshStandardMaterial({
        map: branchMap,
        normalMap: branchNormalMap,

    })


    model.scene.traverse((child) => {
        if (child.name.includes("DOG")) {
            child.material = dogMaterial
        } else {
            child.material = branchMaterial
        }
    })

    const dogModel = useRef(model)

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#section-1",
                endTrigger: "#section-3",
                start: "top top",
                end: "bottom bottom",
                markers: true,
                scrub: true
            }
        })

        tl
            .to(dogModel.current.scene.position, {
                z: "-=0.75",
                y: "+=0.1"
            })
            .to(dogModel.current.scene.rotation, {
                x: `+=${Math.PI / 15}`
            })
            .to(dogModel.current.scene.rotation, {
                y: `-=${Math.PI}`
            }, "third")
            .to(dogModel.current.scene.position, {
               x: "-=0.5",
               z:"+=0.6",
               y:"-=0.0.5",
            }, "third");


    }, [])

    return (
        <>
            <primitive object={model.scene} position={[0.2, -.61, 0]} rotation={[0, Math.PI / 5, 0]} />
            <directionalLight position={[0, 5, 5]} color={0xFFFFFF} intensity={10} />

        </>
    )
}

export default Dog
