<?php

namespace App\Events;

use App\Entity\User;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{

    /** @var Security */
    private $security;

    /** @var InvoiceRepository */
    private $repository;
    /**
     * Obtetion d'un composant de sécurité (recup de l'utilisateur courant) et un repository de l'invoice
     *
     * @param Security $security
     * @param InvoiceRepository $repository
     */
    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(GetResponseForControllerResultEvent $event)
    {
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($invoice instanceof Invoice && $method === "POST") {
            $chrono = $this->repository->findNextChrono($this->security->getUser());
            $invoice->setChrono($chrono);

            if (empty($invoice->getSentAt())) {
                $invoice->setSentAt(new \Datetime());
            }
        }
    }
}
