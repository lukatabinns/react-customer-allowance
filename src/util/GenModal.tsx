import {Button, Text, Modal} from "@bigcommerce/big-design";

const GenModal = ({handleModal, isOpen, deleteAllowance, id}: {handleModal:any, isOpen:boolean, deleteAllowance:any, id:number}) => {

    return (

        <Modal
            actions={[
                {
                    text: 'Cancel',
                    variant: 'subtle',
                    onClick: () => handleModal(),
                },
                { text: 'Yes', onClick: () => deleteAllowance(id) },
            ]}
            closeOnClickOutside={false}
            closeOnEscKey={true}
            header="Delete Ambassador Allowance"
            isOpen={isOpen}
            onClose={() => handleModal()}
        >
            <Text> Are you sure? </Text>
        </Modal>
    );
}

export default GenModal;
