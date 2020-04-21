export default function findItem(arr, _item) {
    const itemIndex = arr.findIndex(
        item => item.id === _item.id
    );

    return itemIndex
}