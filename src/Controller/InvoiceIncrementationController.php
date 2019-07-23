<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\Common\Persistence\ObjectManager;

class InvoiceIncrementationController {

    /** @var ObjectManager */
    private $manager;

    public function __construct(ObjectManager $manager)
    {
        $this->manager = $manager;
    }
    /**
     * Incremente l'invoce donnée en paramétre
     *
     * @param Invoice $data
     * @return void
     */
    public function __invoke(Invoice $data) {
        
        $data->setChrono($data->getChrono() +1 );

        $this->manager->flush();

        dd($data);
    }


}