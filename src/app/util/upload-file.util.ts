export const uploadFile = ({ multiple, type }: { multiple?: boolean, type?: string }) => {
	return new Promise<FileList>((res) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = !!multiple;
		input.accept = type || '*';
		input.style.display = 'none';
    
		input.onchange = () => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			res(input.files!);
		};
		input.click();
	});
};

export const fileToUrl = (file: File) => {
	return new Promise<string>((res) => {
		const img = document.createElement('img');
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = 1024;
		canvas.height = 1024;

		img.src = URL.createObjectURL(file);
		img.onload = () => {
			if (!ctx) {
				res('');
				return;
			}
			ctx.drawImage(img, 0, 0, img.width,  img.height, 0, 0, 1024, 1024);

			canvas.toBlob((blob) => {
				if (!blob) {
					res('');
					return;
				}
				const url = URL.createObjectURL(blob);
				res(url);
			});
		};
	});
};