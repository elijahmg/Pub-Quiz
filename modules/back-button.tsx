import { Button, Container } from '@nextui-org/react';
import Link from 'next/link';

interface Props {
	href?: string;
	title?: string;
}

export function BackButton({ href, title }: Props) {
	return (
		<Container
			css={{
				my: '1rem'
			}}
		>
			<Link href={href || '/'}>
				<Button
					icon={
						<span
							style={{
								fontSize: '20px'
							}}
						>
							&larr;
						</span>
					}
					auto
					bordered
				>
					{title || 'Back to Home page'}
				</Button>
			</Link>
		</Container>
	);
}
