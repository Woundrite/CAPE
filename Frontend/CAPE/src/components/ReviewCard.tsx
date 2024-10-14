'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button } from "@nextui-org/react";
import { Debug } from 'astro:components';

interface ReviewCardInterface {
	img_src: string | undefined,
	Content: string,
	Name: string
}

let ReviewCard = (props: ReviewCardInterface) => {
	return (
		<Card className="max-w-[340px]">
			<CardHeader className="justify-between">
				<div className="flex gap-5">
					<Avatar isBordered radius="full" size="md" src={props.img_src} />
					<div className="flex flex-col gap-1 items-start justify-center">
						<h4 className="text-small font-semibold leading-none text-default-600">{props.Name}</h4>
					</div>
				</div>
			</CardHeader>
			<CardBody className="px-3 py-0 text-small text-default-400">
				<p>

					{props.Content}
				</p>
			</CardBody>
		</Card>
	);
}

export default ReviewCard;