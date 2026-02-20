function LocationsTab(props) {

    const handleClick = () => {
        props.onClick(props.location);
    };

    if (props.selectedLocation === props.location._id) {
        return(
            <div className="text-white bg-[#2d3748] text-center rounded-xl w-20 px-2 py-1 cursor-pointer" onClick={handleClick}>
                {props.location.name}
            </div>
        );
    }

    return(
        <div className="text-[#2d3748] text-center w-20 px-2 py-1 cursor-pointer" onClick={handleClick}>
            {props.location.name}
        </div>
    );
}

export default LocationsTab;