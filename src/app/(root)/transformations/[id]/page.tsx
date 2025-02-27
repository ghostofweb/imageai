"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/shared/Header";
import TransformedImage from "@/components/shared/TransformedImage";
import { Button } from "@/components/ui/button";
import { getImageSize } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";
import { useUser } from "@clerk/nextjs";
import { getImageById } from "@/lib/actions/image.actions";

// With Next.js 13.4+, params is now a Promise.
interface SearchParamProps {
  params: Promise<{ id: string }>;
}

interface ImageType {
  _id: string;
  title: string;
  transformationType: string;
  prompt?: string;
  color?: string;
  aspectRatio?: string;
  secureURL: string;
  config: any;
  author: {
    _id: any; // MongoDB ObjectId
    firstname?: string;
    lastname?: string;
    clerkId?: string; // Make sure this is populated!
  };
}

export default function ImageDetails({ params }: SearchParamProps) {
  // Unwrap the promise using React.use()
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const { user, isLoaded } = useUser();
  const [image, setImage] = useState<ImageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        const data = await getImageById(id);
        setImage(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch image.");
      } finally {
        setLoading(false);
      }
    }
    fetchImage();
  }, [id]);

  if (loading) {
    return <div>Loading image details...</div>;
  }

  if (error || !image) {
    return <div>{error || "Image not found."}</div>;
  }

  // Compare the logged-in user's clerk id to the image author's clerkId.
  // Make sure populateUser includes clerkId.
  const isOwner =
    user && image.author && user.id === image.author.clerkId;

  return (
    <>
      <Header title={image.title} />
      <p className="text-sm text-gray-500 pl-4">
        Owned by:{" "}
        {isOwner
          ? "You"
          : `${image.author.firstname || ""} ${image.author.lastname || ""}`.trim() ||
            image.author._id.toString()}
      </p>

      <section className="mt-5 flex flex-wrap gap-4">
        <div className="p-14-medium md:p-16-medium flex gap-2">
          <p className="text-dark-600">Transformation:</p>
          <p className="capitalize text-purple-400">
            {image.transformationType}
          </p>
        </div>

        {image.prompt && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-dark-600">Prompt:</p>
              <p className="capitalize text-purple-400">{image.prompt}</p>
            </div>
          </>
        )}

        {image.color && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-dark-600">Color:</p>
              <p className="capitalize text-purple-400">{image.color}</p>
            </div>
          </>
        )}

        {image.aspectRatio && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-dark-600">Aspect Ratio:</p>
              <p className="capitalize text-purple-400">{image.aspectRatio}</p>
            </div>
          </>
        )}
      </section>

      <section className="mt-10 border-t border-dark-400/15">
        <div className="transformation-grid">
          {/* ORIGINAL IMAGE */}
          <div className="flex flex-col gap-4">
            <h3 className="h3-bold text-dark-600">Original</h3>
            <Image
              width={getImageSize(image.transformationType, image, "width")}
              height={getImageSize(image.transformationType, image, "height")}
              src={image.secureURL}
              alt="image"
              className="transformation-original_image"
            />
          </div>

          {/* TRANSFORMED IMAGE */}
          <TransformedImage
            image={image}
            type={image.transformationType}
            title={image.title}
            isTransforming={false}
            transformationConfig={image.config}
            hasDownload={true}
          />
        </div>

        {/* Only show update and delete options if the logged-in user is the owner */}
        {isOwner && (
          <div className="mt-4 space-y-4">
            <Button asChild type="button" className="submit-button capitalize">
              <Link href={`/transformations/${image._id}/update`}>
                Update Image
              </Link>
            </Button>
            <DeleteConfirmation imageId={image._id} />
          </div>
        )}
      </section>
    </>
  );
}
