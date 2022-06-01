import { Button, Container, Row, Text, Col } from '@nextui-org/react';
import Link from 'next/link';
import { useMediaQuery } from '../hooks/use-media-query';

interface Props {
	onCreateQuizModalOpen: (isOpen: boolean) => void;
}

export function MainEntry({ onCreateQuizModalOpen }: Props) {
	const isMd = useMediaQuery(650);

	const Wrapper = isMd ? Col : Row;

	return (
		<Container
			sm
			display="flex"
			justify="center"
			alignItems="center"
			css={{
				h: '100vh'
			}}
		>
			<Container
				css={{
					w: 'fit-content',
					h: 'fit-content',
					p: '2rem',
					'box-shadow': '$md',
					'border-radius': '$md'
				}}
			>
				<Text h1 css={{ m: 0 }}>
					Pub quiz
				</Text>
				<Text h3 css={{ m: 0, 'max-width': '30rem' }}>
					This is simple application allows you to create, host or connect to pub quizzes
				</Text>
				<Wrapper
					css={{
						mt: isMd ? '2rem' : '4rem',
						'align-items': 'center',
						'justify-content': 'center'
					}}
				>
					<Link href="/admin">
						<Button
							bordered
							auto
							css={{
								mr: '.5rem',
								mt: '0.3rem'
							}}
						>
							Admin dashboard
						</Button>
					</Link>
					<Button
						css={{
							mt: '0.3rem'
						}}
						auto
						onClick={() => onCreateQuizModalOpen(true)}
					>
						Create quiz
					</Button>
					<Link href="/connect">
						<Button
							color="success"
							auto
							css={{
								ml: isMd ? 0 : '2rem',
								mt: '0.3rem'
							}}
						>
							Connect
						</Button>
					</Link>
				</Wrapper>
			</Container>
		</Container>
	);
}
